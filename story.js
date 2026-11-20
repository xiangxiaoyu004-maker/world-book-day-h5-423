const stories = {
  train: {
    mark: '车票', symbol: '✦', choice: '去远方', color: 'rust',
    image: 'train', alt: '蒸汽火车穿过夕阳下的群山',
    scene: '下一站，远方',
    passage: '车窗外，最后一间亮灯的小屋也退到了身后。手里这张车票，只写了出发时间。至于下一站在哪儿，要等火车停下来才知道。',
    activity: '展开那张地图', action: '展开地图',
    discovery: '从伦敦出发，向东走，一直走到回到伦敦。同一段旅程里，你会换上轮船、火车，有时还得临时另找办法。',
    book: '八十天环游地球', author: '儒勒·凡尔纳',
    note: '我是在晚自习后读的。人还坐在教室里，心已经赶上了下一班火车。'
  },
  leaf: {
    mark: '叶片', symbol: '❋', choice: '去草丛里', color: 'green',
    image: 'leaf', alt: '一只瓢虫爬在草叶上',
    scene: '蹲下来，看看草丛',
    passage: '把脸凑近一些。平时一脚就能跨过的那片草地，忽然变得像树林那么大。有东西从叶尖经过，另一只却藏得更深。',
    activity: '叶子下面藏着谁？', action: '拨开叶子',
    discovery: '画面的右下角躲着一只深色甲虫。顺着它前面的那片枯叶看，能找到它伸出来的触角。',
    book: '昆虫记', author: '让-亨利·法布尔',
    note: '读完以后，我在操场边蹲了十分钟，第一次认真看一只甲虫往哪儿走。'
  },
  alley: {
    mark: '旧照片', symbol: '◈', choice: '回小时候', color: 'wine',
    image: 'alley', alt: '一个背影走进秋天的老北京胡同',
    scene: '胡同尽头是小时候',
    passage: '门边停着一辆自行车，巷子里有人慢慢走过。小时候并不知道，那些寻常得几乎记不住的下午，有一天会想起来。',
    activity: '把记忆擦亮一点', action: '擦亮照片',
    discovery: '照片里那个小女孩正往胡同深处走。跟着英子的眼睛看，很多大人说不清楚的事，慢慢有了自己的样子。',
    book: '城南旧事', author: '林海音',
    note: '我小时候也常在巷子口等人。读到英子走过胡同，忽然想起我家那扇掉漆的门。'
  }
};

const page = document.querySelector('#page');
const progress = document.querySelector('#progress');
const back = document.querySelector('#back');
const historyPage = [];
const recommendation = { book: '', recipient: '' };
let current = 1;
let route = 'train';
let found = false;
let previewBook = '';

const button = (label, action, extra = '') =>
  `<button type="button" class="button ${extra}" data-action="${action}">${label}</button>`;
const sceneImage = (name, alt, extra = '') =>
  `<img class="scene-image ${extra}" src="assets/${name}.webp" alt="${alt}" width="768" height="512">`;
const stepTitle = (text) => `<h1 tabindex="-1">${text}</h1>`;

function render() {
  const story = stories[route];
  page.className = `screen screen-${current} tone-${story.color}`;
  progress.textContent = `${String(current).padStart(2, '0')} / 09`;
  progress.setAttribute('aria-label', `第 ${current} 页，共 9 页`);
  document.querySelector('#progress-line').style.width = `${current / 9 * 100}%`;
  back.hidden = historyPage.length === 0;
  document.querySelector('#footer-date').hidden = current !== 1 && current !== 9;

  switch (current) {
    case 1:
      page.innerHTML = `<section class="hero">
        ${sceneImage('classroom', '午后教室里，课桌脚边有一本书')}
        <div class="hero-copy"><div class="date-seal" aria-hidden="true">04<br>23</div>
          ${stepTitle('同学，<br>你的书掉了。')}
          <p>放学后的教室里，有人留下了一本书。</p>
          ${button('捡起来看看', 'next', 'light')}
        </div></section>`;
      break;
    case 2:
      page.innerHTML = `<section class="paper-screen letter-screen">
        ${stepTitle('这本书是故意留下的。')}
        <details class="letter">
          <summary>展开纸条</summary>
          <div class="letter-text"><p>捡到书的同学，<br>先别急着看封面。<br>翻开第一页，选一张你喜欢的书签。</p>
          <p class="signature">4 月 23 日<br>上一位读者</p>
          ${button('翻开第一页', 'next')}</div>
        </details>
      </section>`;
      break;
    case 3:
      page.innerHTML = `<section class="paper-screen">
        ${stepTitle('今天，你想去哪儿？')}
        <p class="deck">从书里抽出一张书签。</p>
        <div class="bookmark-row">
          ${Object.entries(stories).map(([key, item]) => `<button type="button" data-route="${key}" class="bookmark tone-${item.color}">
            <img src="assets/${key}.webp" alt="" width="768" height="512">
            <span class="bookmark-symbol" aria-hidden="true">${item.symbol}</span><small>${item.mark}</small><strong>${item.choice}</strong>
          </button>`).join('')}
        </div></section>`;
      break;
    case 4:
      page.innerHTML = `<section class="paper-screen spread">
        ${sceneImage(story.image, story.alt)}
        ${stepTitle(story.scene)}
        <p class="passage">${story.passage}</p>
        ${button('再读一页', 'next')}
      </section>`;
      break;
    case 5:
      page.innerHTML = `<section class="paper-screen activity-screen">
        ${stepTitle(story.activity)}
        <div class="activity activity-${route} ${found ? 'uncovered' : ''}">
          ${route === 'train' ? `<div class="folded-map"><span>伦敦</span><i></i><span>苏伊士</span><i></i><span>孟买</span><i></i><span>横滨</span><i></i><span>伦敦</span></div>` : sceneImage(story.image, story.alt)}
          <span class="activity-cover" aria-hidden="true">${story.symbol}</span>
        </div>
        <p class="discovery" ${found ? '' : 'hidden'}>${story.discovery}</p>
        ${found ? button('看看是哪本书', 'next') : button(story.action, 'discover')}
      </section>`;
      break;
    case 6:
      page.innerHTML = `<section class="paper-screen reveal-screen">
        ${stepTitle('原来，我走进了这本书。')}
        <div class="book-cover tone-${story.color}">
          ${sceneImage(story.image, '')}
          <div><strong>${story.book}</strong><small>${story.author} 著</small></div>
        </div>
        <blockquote><p>${story.note}</p><cite>上一位读者的留言</cite></blockquote>
        ${button('看看教室里还有什么', 'next')}
      </section>`;
      break;
    case 7: {
      const others = Object.entries(stories).filter(([key]) => key !== route);
      page.innerHTML = `<section class="paper-screen shelf-screen">
        ${stepTitle('还有两本，落在别处。')}
        ${sceneImage('classroom', '窗台和课桌都被夕阳照亮')}
        <div class="shelf-books">${others.map(([key, item], index) => `<button type="button" class="shelf-book tone-${item.color}" data-preview="${key}" aria-pressed="${previewBook === key}">
          <small>${index === 0 ? '窗台' : '隔壁课桌'}</small><strong>《${item.book}》</strong></button>`).join('')}</div>
        <div class="shelf-note" aria-live="polite">${previewBook ? stories[previewBook].note : '点一本书，看看夹在里面的荐书纸条。'}</div>
        <div class="end-actions">${button('我也想留一本', 'next')}
        ${button('换一张书签', 'bookmarks', 'secondary')}</div>
      </section>`;
      break;
    }
    case 8:
      page.innerHTML = `<section class="paper-screen form-screen">
        ${stepTitle('轮到你留一本了。')}
        <form class="library-card" id="recommendation">
          <div class="card-heading"><span>荐书卡</span><span>04.23</span></div>
          <label for="book">我想留下</label>
          <input name="book" id="book" placeholder="写下书名" maxlength="36" required>
          <label for="recipient">想把它留给</label>
          <textarea name="recipient" id="recipient" placeholder="比如，那个最近有点累的同桌" maxlength="80" rows="2" required></textarea>
          <button class="button" type="submit">把书留在课桌边</button>
        </form></section>`;
      page.querySelector('#book').value = recommendation.book;
      page.querySelector('#recipient').value = recommendation.recipient;
      break;
    case 9:
      page.innerHTML = `<section class="paper-screen ending-screen">
        ${stepTitle('等下一个人捡到。')}
        ${sceneImage('classroom', '开头的课桌旁，夕阳落在书上')}
        <div class="closing-note"><strong id="final-book"></strong><p id="final-recipient"></p><span class="end-seal">4·23<br>世界读书日</span></div>
        <p class="closing-line">同学，你的书掉了。</p>
        <img id="poster" class="poster" alt="你生成的世界读书日荐书海报，可长按保存" hidden>
        <div class="end-actions">
          ${button('盖章生成荐书海报', 'poster')}
          <a id="download" class="button" download="世界读书日-我的荐书海报.png" hidden>保存海报</a>
          ${button('再选一张书签', 'bookmarks', 'secondary')}
        </div></section>`;
      page.querySelector('#final-book').textContent = `《${recommendation.book}》`;
      page.querySelector('#final-recipient').textContent = `想把它留给${recommendation.recipient}`;
      break;
  }
}

function show(step) {
  historyPage.push(current);
  current = step;
  render();
  focusTitle();
}

function focusTitle() {
  window.scrollTo(0, 0);
  page.querySelector('h1').focus({ preventScroll: true });
}

back.addEventListener('click', () => {
  if (!historyPage.length) return;
  current = historyPage.pop();
  render();
  focusTitle();
});

page.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;
  const { action, route: chosen, preview } = target.dataset;
  if (chosen) {
    route = chosen;
    found = false;
    previewBook = '';
    show(4);
  } else if (preview) {
    previewBook = preview;
    page.querySelectorAll('[data-preview]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === target));
    });
    page.querySelector('.shelf-note').textContent = stories[preview].note;
  } else if (action === 'discover') {
    found = true;
    page.querySelector('.activity').classList.add('uncovered');
    page.querySelector('.discovery').hidden = false;
    target.outerHTML = button('看看是哪本书', 'next');
    page.querySelector('[data-action="next"]').focus({ preventScroll: true });
  } else if (action === 'bookmarks') {
    historyPage.splice(0, historyPage.length, 1, 2);
    current = 3;
    render();
    focusTitle();
  } else if (action === 'poster') {
    makePoster(target);
  } else if (action === 'next') {
    show(current + 1);
  }
});

page.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  for (const field of [form.elements.book, form.elements.recipient]) {
    if (!field.value.trim()) {
      field.value = '';
      field.reportValidity();
      return;
    }
  }
  recommendation.book = form.elements.book.value.trim();
  recommendation.recipient = form.elements.recipient.value.trim().replace(/\s+/g, ' ');
  show(9);
});

function drawLines(ctx, text, width, lineHeight, x, y) {
  let line = '';
  for (const char of text) {
    if (line && ctx.measureText(line + char).width > width) {
      ctx.fillText(line, x, y);
      line = '';
      y += lineHeight;
    }
    line += char;
  }
  ctx.fillText(line, x, y);
}

async function makePoster(trigger) {
  trigger.disabled = true;
  try {
    const art = new Image();
    art.src = 'assets/classroom.webp';
    await art.decode();
    if (!trigger.isConnected) return;
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1150;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8edda';
    ctx.fillRect(0, 0, 900, 1150);
    ctx.drawImage(art, 0, 0, 900, 600);
    ctx.fillStyle = '#282d22';
    ctx.font = 'bold 45px "Noto Serif SC", "Songti SC", SimSun, serif';
    drawLines(ctx, `《${recommendation.book}》`, 764, 52, 68, 686);
    ctx.font = '32px "PingFang SC", "Microsoft YaHei", sans-serif';
    drawLines(ctx, `想把它留给${recommendation.recipient}`, 764, 43, 68, 840);
    ctx.strokeStyle = '#a83c2e';
    ctx.strokeRect(68, 1032, 220, 62);
    ctx.fillStyle = '#a83c2e';
    ctx.font = 'bold 24px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillText('4·23 世界读书日', 82, 1071);
    ctx.fillStyle = '#5f594a';
    ctx.fillText('同学，你的书掉了。', 505, 1071);
    const data = canvas.toDataURL('image/png');
    const poster = page.querySelector('#poster');
    const download = page.querySelector('#download');
    poster.src = data;
    poster.hidden = false;
    download.href = data;
    download.hidden = false;
    trigger.hidden = true;
    poster.scrollIntoView({ block: 'nearest' });
  } catch {
    trigger.disabled = false;
    trigger.textContent = '生成失败，点此重试';
  }
}

render();
