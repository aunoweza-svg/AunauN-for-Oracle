(() => {
  const key = 'phayao-mission-reminders-v1';
  const boxes = [...document.querySelectorAll('[data-mission]')];
  const status = document.getElementById('mission-storage');
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; }
  catch (_) { status.textContent = 'เบราว์เซอร์ไม่สามารถอ่านข้อมูลที่บันทึกไว้ได้ เครื่องหมายอาจไม่อยู่หลังปิดหน้าเว็บ'; }
  boxes.forEach(box => { box.checked = saved[box.dataset.mission] === true; });
  function update() {
    const count = boxes.filter(box => box.checked).length;
    document.getElementById('mission-count').textContent = `${count} / ${boxes.length}`;
    document.getElementById('mission-progress-bar').style.width = `${count / boxes.length * 100}%`;
    boxes.forEach(box => box.closest('.mission-card').classList.toggle('is-marked', box.checked));
    try {
      localStorage.setItem(key, JSON.stringify(Object.fromEntries(boxes.map(box => [box.dataset.mission, box.checked]))));
    } catch (_) { status.textContent = 'เบราว์เซอร์ไม่อนุญาตให้บันทึก เครื่องหมายจะอยู่เฉพาะขณะเปิดหน้านี้'; }
  }
  boxes.forEach(box => box.addEventListener('change', update));
  document.getElementById('mission-reset').addEventListener('click', () => {
    boxes.forEach(box => { box.checked = false; });
    update();
  });
  update();
})();
