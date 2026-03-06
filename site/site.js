    const bookmarklet = {{BOOKMARKLET_JSON}};
    const copyButton = document.getElementById("copy-bookmarklet");
    const copyStatus = document.getElementById("copy-status");
    const bookmarksTip = document.getElementById("bookmarks-tip");
    const slackTime = document.getElementById("slack-time");
    const heroArrowLayer = document.querySelector(".hero-arrow-layer");
    const heroArrow = document.getElementById("hero-arrow");
    const heroArrowPath = document.getElementById("hero-arrow-path");
    const heroArrowHead = document.getElementById("hero-arrow-head");
    const bookmarkletLink = document.getElementById("bookmarklet-link");
    let arrowFrame = 0;
    let arrowNeedsUpdate = false;

    function updatePlatformTip() {
      const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
      const isMac = /mac/i.test(platform);
      const shortcut = isMac ? "Cmd+Shift+B" : "Ctrl+Shift+B";
      bookmarksTip.innerHTML = "Tip: <code>" + shortcut + "</code> to toggle bookmarks bar";
    }

    function updateSlackTime() {
      const now = new Date();
      slackTime.textContent = now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    }

    function updateArrow() {
      if (window.innerWidth < 900) {
        heroArrow.style.display = "none";
        return;
      }

      const linkRect = bookmarkletLink.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const width = Math.max(1, document.documentElement.clientWidth);
      const height = Math.max(1, document.documentElement.scrollHeight);

      heroArrowLayer.style.height = height + "px";
      heroArrow.setAttribute("viewBox", "0 0 " + width + " " + height);
      heroArrow.style.display = "block";

      const startX = linkRect.left + scrollX - 22;
      const startY = linkRect.top + scrollY + linkRect.height * 0.44;
      const endX = Math.max(24, startX - 80);
      const endY = 11;
      const control1X = startX - 96;
      const control1Y = startY;
      const control2X = endX;
      const control2Y = startY - 112;

      const tangentX = control2X - endX;
      const tangentY = control2Y - endY;
      const tangentLength = Math.hypot(tangentX, tangentY) || 1;
      const unitX = tangentX / tangentLength;
      const unitY = tangentY / tangentLength;
      const normalX = -unitY;
      const normalY = unitX;
      const stemX = endX + unitX * 14;
      const stemY = endY + unitY * 14;
      const headLeftX = endX + unitX * 16 + normalX * 10;
      const headLeftY = endY + unitY * 16 + normalY * 10;
      const headRightX = endX + unitX * 16 - normalX * 10;
      const headRightY = endY + unitY * 16 - normalY * 10;

      const path = "M " + stemX + " " + stemY + " C " + control2X + " " + control2Y + ", " + control1X + " " + control1Y + ", " + startX + " " + startY;
      const headPath = "M " + headLeftX + " " + headLeftY + " L " + endX + " " + endY + " L " + headRightX + " " + headRightY;

      heroArrowPath.setAttribute("d", path);
      heroArrowHead.setAttribute("d", headPath);
    }

    function flushArrowUpdate() {
      arrowFrame = 0;
      updateArrow();

      if (arrowNeedsUpdate) {
        arrowNeedsUpdate = false;
        scheduleArrowUpdate();
      }
    }

    function scheduleArrowUpdate() {
      arrowNeedsUpdate = true;

      if (arrowFrame) {
        return;
      }

      arrowFrame = requestAnimationFrame(flushArrowUpdate);
    }

    function setStatus(message, isError) {
      copyStatus.textContent = message;
      copyStatus.style.color = isError ? "#a11d2d" : "var(--success)";
    }

    async function copyBookmarklet() {
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          await navigator.clipboard.writeText(bookmarklet);
        } else {
          const input = document.createElement("textarea");
          input.value = bookmarklet;
          input.setAttribute("readonly", "");
          input.style.position = "absolute";
          input.style.left = "-9999px";
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          input.remove();
        }

        setStatus("Bookmarklet code copied.", false);
      } catch (_error) {
        setStatus("Copy failed. Drag the bookmarklet instead.", true);
      }
    }

    updatePlatformTip();
    updateSlackTime();
    scheduleArrowUpdate();
    copyButton.addEventListener("click", copyBookmarklet);
    window.addEventListener("resize", scheduleArrowUpdate);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", scheduleArrowUpdate);
    }
    if (typeof ResizeObserver === "function") {
      const arrowResizeObserver = new ResizeObserver(scheduleArrowUpdate);
      arrowResizeObserver.observe(document.documentElement);
      arrowResizeObserver.observe(bookmarkletLink);
    }
    window.addEventListener("load", scheduleArrowUpdate);
    window.setInterval(updateSlackTime, 5000);
