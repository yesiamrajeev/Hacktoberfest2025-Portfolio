<button id="backToTop">⬆ Top</button>

<style>
  #backToTop {
    display: none;
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 10px 15px;
    border: none;
    background: #ff9800;
    color: white;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  }
  #backToTop:hover {
    background: #e68900;
  }
</style>

<script>
  const btn = document.getElementById("backToTop");

  window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  };

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
</script>
