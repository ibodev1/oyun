const puan = document.getElementById("puan");
const les = document.getElementById("les");
const level = document.getElementById("level");
const start_panel = document.getElementById("start_panel");
const end_panel = document.getElementById("end_panel");
const stop_panel = document.getElementById("stop_panel");
const ayarlar = document.getElementById("ayarlar");
const stop_btn = document.getElementById("stop");
const devam_btn = document.getElementById("devam");
const p_puan = document.getElementById("p_puan");
const p_les = document.getElementById("p_les");
const p_level = document.getElementById("p_level");
const canvas = document.getElementById("canvas");
const oyuncurengi_value = document.getElementById("oyuncurengi_value");
const toprengi_value = document.getElementById("toprengi_value");
const zorluk_form = document.querySelector("#zorluk");
const oyuncurengi_form = document.querySelector("#oyuncurengi_from");
const toprengi_form = document.querySelector("#toprengi_form");
const close_btn = document.querySelector("#close_btn");
const ayarlar_btn = document.querySelector("#ayarlar_btn");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
var playing = false;
var player, angle, bullets, enemies, maxenemy, score, kills, levels;
var zorluk = "orta";
var oyuncurengi = "#f2f2f2";
var toprengi = "hsl(218, 100%, 50%)";
oyuncurengi_value.innerText = oyuncurengi;
toprengi_value.innerText = toprengi;

ctx.clearRect(0, 0, width, height);

ayarlar_btn.addEventListener("click", function () {
  ayarlar.classList.remove("hidden");
})

close_btn.addEventListener("click", function () {
  ayarlar.classList.add("hidden");
});

zorluk_form.addEventListener("change", function (event) {
  var zorluk_data = new FormData(zorluk_form);
  for (const entry of zorluk_data) {
    zorluk = entry[1];
  };
  event.preventDefault();
}, false);

oyuncurengi_form.addEventListener("change", function (event) {
  var oyuncurengi_data = new FormData(oyuncurengi_form);
  for (const entry of oyuncurengi_data) {
    oyuncurengi = entry[1];
  };
  oyuncurengi_value.innerText = oyuncurengi;
  event.preventDefault();
}, false);

toprengi_form.addEventListener("change", function (event) {
  var toprengi_data = new FormData(toprengi_form);
  for (const entry of toprengi_data) {
    toprengi = entry[1];
  };
  toprengi_value.innerText = toprengi;
  event.preventDefault();
}, false);

class Circle {
  constructor(bx, by, tx, ty, r, c, s) {
    this.bx = bx;
    this.by = by;
    this.tx = tx;
    this.ty = ty;
    this.x = bx;
    this.y = by;
    this.r = r;
    this.c = c;
    this.s = s;
  }
  draw() {
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
  update() {
    var dx = this.tx - this.bx;
    var dy = this.ty - this.by;
    var hp = Math.sqrt(dx * dx + dy * dy);
    this.x += (dx / hp) * this.s;
    this.y += (dy / hp) * this.s;
  }
  remove() {
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      return true;
    }
    return false;
  }
}

class Player {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.fillRect(0, -this.r * 0.4, this.r + 15, this.r * 0.8);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

function addEnemy() {
  for (var i = enemies.length; i < maxenemy; i++) {
    var r = Math.random() * 25 + 10;
    if(toprengi == "#00000"){
      toprengi = "hsl(" + Math.random() * 360 + ",50%,50%)";
    }
    if (zorluk == "zor") {
      var s = .5 + ((40 - (r / 40) * r) / 13) / maxenemy;
    } else if (zorluk == "orta") {
      var s = .5 + ((40 - (r / 40) * r) / 90) / maxenemy;
    } else if (zorluk == "kolay") {
      var s = .5 + ((40 - (r / 40) * r) / 120) / maxenemy;
    }
    var x, y;
    if (Math.random() < 0.5) {
      x = Math.random() > 0.5 ? width : 0;
      y = Math.random() * height;
    } else {
      x = Math.random() * width;
      y = Math.random() < 0.5 ? height : 0;
    }

    enemies.push(new Circle(x, y, player.x, player.y, r, toprengi, s));
  }
}

function collision(x1, y1, r1, x2, y2, r2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  var hp = Math.sqrt(dx * dx + dy * dy);
  if (hp < r1 + r2) {
    return true;
  }
  return false;
}

function animate() {
  if (playing) {
    requestAnimationFrame(animate);
    //ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.fillRect(0, 0, width, height);
    ctx.fill();
    enemies.forEach((enemy, e) => {
      bullets.forEach((bullet, b) => {
        if (collision(enemy.x, enemy.y, enemy.r, bullet.x, bullet.y, bullet.r)) {
          if (enemy.r < 15) {
            enemies.splice(e, 1);
            score += 25;
            kills++;
            if (kills % 10 === 0) {
              maxenemy++;
              levels++;
            }
            addEnemy();
          } else {
            enemy.r -= 5;
            score += 5;
          }
          bullets.splice(b, 1);
        }
      });


      if (collision(enemy.x, enemy.y, enemy.r, player.x, player.y, player.r)) {
        end_panel.classList.remove("hidden");
        stop_btn.classList.add("hidden");
        playing = false;
      }
      if (enemy.remove()) {
        enemies.splice(e, 1);
        addEnemy();
      }
      enemy.update();
      enemy.draw();
    });

    bullets.forEach((bullet, b) => {
      if (bullet.remove()) {
        bullets.splice(b, 1);
      }
      bullet.update();
      bullet.draw();
    });

    player.draw();
    puan.innerHTML = '<i class="fas fa-star"></i> Puanın : ' + score;
    les.innerHTML = '<i class="fas fa-skull-crossbones"></i> Leş : ' + kills;
    level.innerHTML = '<i class="fas fa-plus"></i> Level : ' + levels;
    p_puan.innerHTML = '<i class="fas fa-star"></i> Puanın : ' + score;
    p_les.innerHTML = '<i class="fas fa-skull-crossbones"></i> Leş : ' + kills;
    p_level.innerHTML = '<i class="fas fa-plus"></i> Level : ' + levels;
  }
}

if (!playing) {
  window.addEventListener("mousemove", (e) => {
    if (playing) {
      var dx = e.pageX - player.x;
      var dy = e.pageY - player.y;
      var tetha = Math.atan2(dy, dx);
      tetha *= 180 / Math.PI;
      angle = tetha;
    }
  });

  window.addEventListener("touchmove", (e) => {
    if (playing) {
      var dx = e.pageX - player.x;
      var dy = e.pageY - player.y;
      var tetha = Math.atan2(dy, dx);
      tetha *= 180 / Math.PI;
      angle = tetha;
    }
  });

  window.addEventListener("touchmove", (e) => {
    bullets.push(new Circle(player.x, player.y, e.pageX, e.pageY, 5, "white", 3));
  });


  window.addEventListener("click", (e) => {
    bullets.push(new Circle(player.x, player.y, e.pageX, e.pageY, 5, "white", 3));
  });
}

stop_btn.addEventListener("click", function () {
  stop_panel.classList.remove("hidden");
  stop_btn.classList.add("hidden");
  playing = false;
});

devam_btn.addEventListener("click", function () {
  stop_panel.classList.add("hidden");
  stop_btn.classList.remove("hidden");
  playing = true;
  player = new Player(width / 2, height / 2, 20, oyuncurengi);
  addEnemy();
  animate();
});

function init() {
  console.log("Zorluk : "+zorluk);
  console.log("Oyuncu Rengi : "+oyuncurengi);
  console.log("İlk Top Rengi : "+toprengi);
  playing = true;
  score = 0;
  angle = 0;
  kills = 0;
  levels = 0;
  bullets = [];
  enemies = [];
  maxenemy = 1;
  start_panel.classList.add("hidden");
  end_panel.classList.add("hidden");
  stop_panel.classList.add("hidden");
  stop_btn.classList.remove("hidden");
  player = new Player(width / 2, height / 2, 20, oyuncurengi);
  addEnemy();
  animate();
}


//init();