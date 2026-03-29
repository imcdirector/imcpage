import json
import os
import shutil
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PORT = 8131


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return

    def copyfile(self, source, outputfile):
        try:
            shutil.copyfileobj(source, outputfile)
        except (ConnectionResetError, BrokenPipeError):
            return


def start_server():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), partial(QuietHandler, directory=ROOT))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def get_browser_binary():
    candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    for candidate in candidates:
        if os.path.exists(candidate):
            return candidate
    raise FileNotFoundError("Chrome or Edge was not found.")


def build_driver(width=1400, height=900):
    options = Options()
    options.binary_location = get_browser_binary()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument(f"--window-size={width},{height}")
    return webdriver.Chrome(options=options)


def verify_index(driver, mobile=False):
    driver.get(f"http://127.0.0.1:{PORT}/index.html")
    WebDriverWait(driver, 20).until(lambda d: d.execute_script("return document.readyState") == "complete")
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "hero-title")))
    time.sleep(4.8)

    title = driver.find_element(By.ID, "hero-title")
    rect_before = title.rect
    ActionChains(driver).move_to_element(title).perform()
    time.sleep(0.3)
    rect_hover = title.rect

    before = driver.execute_script(
        """
        const audio = document.getElementById("site-audio");
        return {
          noteExists: !!document.querySelector(".hero__entry-note"),
          paused: audio.paused,
          currentTime: audio.currentTime,
          width: window.innerWidth,
          mobile: window.matchMedia("(max-width: 640px)").matches
        };
        """
    )

    title.click()
    time.sleep(1.0)

    after = driver.execute_script(
        """
        const audio = document.getElementById("site-audio");
        return {
          paused: audio.paused,
          currentTime: audio.currentTime,
          chapterOpen: document.body.classList.contains("scene-chapter-open"),
          aboutHidden: document.getElementById("scene-about").getAttribute("aria-hidden")
        };
        """
    )

    return {
        "mobile_mode": mobile,
        "before": before,
        "after": after,
        "rect_before": rect_before,
        "rect_hover": rect_hover,
    }


def verify_wrapper(driver, page):
    driver.get(f"http://127.0.0.1:{PORT}/{page}")
    WebDriverWait(driver, 20).until(lambda d: d.execute_script("return document.readyState") == "complete")
    frame = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.TAG_NAME, "iframe")))
    driver.switch_to.frame(frame)
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "hero-title")))
    state = driver.execute_script(
        """
        return {
          width: window.innerWidth,
          mobile: window.matchMedia("(max-width: 640px)").matches
        };
        """
    )
    driver.switch_to.default_content()
    return state


def main():
    server = start_server()
    time.sleep(0.6)

    results = {}

    desktop = build_driver(1400, 900)
    try:
      results["desktop_index"] = verify_index(desktop, mobile=False)
      results["web_wrapper"] = verify_wrapper(desktop, "preview-web.html")
    finally:
      desktop.quit()

    mobile = build_driver(390, 844)
    try:
      results["mobile_index"] = verify_index(mobile, mobile=True)
      results["mobile_wrapper"] = verify_wrapper(mobile, "preview-mobile.html")
    finally:
      mobile.quit()

    server.shutdown()
    server.server_close()

    assert results["desktop_index"]["before"]["noteExists"] is False
    assert results["mobile_index"]["before"]["noteExists"] is False

    assert results["desktop_index"]["before"]["mobile"] is False
    assert results["web_wrapper"]["mobile"] is False
    assert results["mobile_index"]["before"]["mobile"] is True
    assert results["mobile_wrapper"]["mobile"] is True

    assert results["desktop_index"]["after"]["aboutHidden"] == "false"
    assert results["desktop_index"]["after"]["chapterOpen"] is True
    assert results["desktop_index"]["after"]["paused"] is False
    assert results["desktop_index"]["after"]["currentTime"] > 0.1

    assert results["mobile_index"]["after"]["aboutHidden"] == "false"
    assert results["mobile_index"]["after"]["chapterOpen"] is True
    assert results["mobile_index"]["after"]["paused"] is False
    assert results["mobile_index"]["after"]["currentTime"] > 0.1

    assert results["desktop_index"]["rect_before"] == results["desktop_index"]["rect_hover"]
    assert results["mobile_index"]["rect_before"] == results["mobile_index"]["rect_hover"]

    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
