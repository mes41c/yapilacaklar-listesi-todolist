function initWeeklyPlanner() {
    // ---- ELEMENT SEÇİMLERİ ----
    const gorevInput = document.getElementById('gorev-input');
    const oncelikSelect = document.getElementById('oncelik-select');
    const tarihInput = document.getElementById('tarih-input');
    const gorevEkleBtn = document.getElementById('gorev-ekle-btn');
    const aramaInput = document.getElementById('arama-input');
    const haftaBaslik = document.getElementById('hafta-baslik');
    const haftalikPlanlayiciDiv = document.querySelector('.haftalik-planlayici');
    const oncekiHaftaBtn = document.getElementById('onceki-hafta-btn');
    const sonrakiHaftaBtn = document.getElementById('sonraki-hafta-btn');
    const disaAktarBtn = document.getElementById('disa-aktar-btn');
    const iceAktarBtn = document.getElementById('ice-aktar-btn');
    const iceAktarInput = document.getElementById('ice-aktar-input');

    // ---- UYGULAMA DURUMU (STATE) ----
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        if (task.dueDate && !task.dueDates) {
            task.dueDates = [task.dueDate];
            delete task.dueDate;
        } else if (!task.dueDates) {
            task.dueDates = [];
        }
    });
    let mevcutTarih = new Date();

    // ---- VERİ YÖNETİMİ ----
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // ---- ANA RENDER FONKSİYONU ----
    const renderAll = () => {
        renderWeekLayout();
        renderTasks();
        addEventListenersToTasks();
    };
    
    // ---- GÖREV OLUŞTURMA & YÖNETİMİ ----
    const addTask = () => {
        const gorevMetni = gorevInput.value.trim();
        if (gorevMetni === '') {
            alert('Lütfen bir görev giriniz.');
            return;
        }
        const yeniGorev = {
            id: Date.now().toString(),
            text: gorevMetni,
            priority: oncelikSelect.value,
            dueDates: tarihInput.value ? [tarihInput.value] : [],
            completed: false,
        };
        tasks.push(yeniGorev);
        saveTasks();
        renderAll();
        gorevInput.value = '';
        tarihInput.value = '';
    };

    // ---- HAFTA GÖRÜNÜMÜ OLUŞTURMA ----
    const getWeekDays = (date) => {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        const week = [];
        for (let i = 0; i < 7; i++) {
            const weekDay = new Date(startOfWeek);
            weekDay.setDate(startOfWeek.getDate() + i);
            week.push(weekDay);
        }
        return week;
    };

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const renderWeekLayout = () => {
        haftalikPlanlayiciDiv.innerHTML = '';
        const weekDays = getWeekDays(mevcutTarih);
        const gunIsimleri = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
        const haftaBaslangic = weekDays[0];
        const haftaBitis = weekDays[6];
        haftaBaslik.textContent = `${haftaBaslangic.toLocaleDateString('tr-TR')} - ${haftaBitis.toLocaleDateString('tr-TR')}`;

        weekDays.forEach((day, index) => {
            const dateStr = formatDate(day);
            haftalikPlanlayiciDiv.insertAdjacentHTML('beforeend', `
                <div class="gun-sutunu">
                    <div class="gun-baslik">
                        <h3>${gunIsimleri[index]}</h3>
                        <span class="tarih-span">${day.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}</span>
                    </div>
                    <div class="gorev-listesi" data-date="${dateStr}"></div>
                </div>
            `);
        });
    };

    // ---- GÖREVLERİ EKRANA ÇİZME ----
    const renderTasks = () => {
        document.querySelectorAll('.gorev-listesi').forEach(l => l.innerHTML = '');
        const anaListe = document.querySelector('.gorev-listesi[data-day="atanmamis"]');
        const aramaMetni = aramaInput.value.toLowerCase();
        const filtrelenmisGorevler = tasks.filter(t => t.text.toLowerCase().includes(aramaMetni));
        const weekDaysStr = getWeekDays(mevcutTarih).map(formatDate);

        filtrelenmisGorevler.forEach(task => {
            anaListe.appendChild(createGorevElementi(task));
            task.dueDates.forEach(date => {
                if (weekDaysStr.includes(date)) {
                    const gunListesi = document.querySelector(`.gorev-listesi[data-date="${date}"]`);
                    if (gunListesi) {
                        gunListesi.appendChild(createGorevElementi(task));
                    }
                }
            });
        });
    };

    const createGorevElementi = (task) => {
        const gorevElementi = document.createElement('div');
        gorevElementi.className = 'gorev';
        gorevElementi.setAttribute('draggable', true);
        gorevElementi.setAttribute('data-id', task.id);
        gorevElementi.setAttribute('data-priority', task.priority);
        if (task.completed) gorevElementi.classList.add('tamamlandi');
        
        let tarihBilgisi = '';
        if (task.dueDates && task.dueDates.length > 0) {
            tarihBilgisi = `<div class="gorev-alt-kisim">Tarihler: ${[...task.dueDates].sort().join(', ')}</div>`;
        }

        gorevElementi.innerHTML = `
            <div class="gorev-ust-kisim">
                <span class="gorev-metni">${task.text}</span>
                <div class="gorev-butonlari">
                    <button class="gorev-butonu tamamla-btn" title="Görevi Tamamla">✔</button>
                    <button class="gorev-butonu sil-btn" title="Görevi Sil / Atamayı Kaldır">✖</button>
                </div>
            </div>
            ${tarihBilgisi}
        `;
        return gorevElementi;
    };

    // ---- OLAY DİNLEYİCİLERİ (YENİ SİLME MANTIĞI İLE) ----
    const addEventListenersToTasks = () => {
        document.querySelectorAll('.gorev').forEach(gorevElementi => {
            if (gorevElementi.listenerAttached) return;
            gorevElementi.listenerAttached = true;
            
            const gorevId = gorevElementi.getAttribute('data-id');

            // GÖREVİ TAMAMLAMA BUTONU
            gorevElementi.querySelector('.tamamla-btn').addEventListener('click', () => {
                const task = tasks.find(t => t.id === gorevId);
                if (task) { task.completed = !task.completed; saveTasks(); renderAll(); }
            });

            // SİLME BUTONU (AKILLI MANTIK)
            gorevElementi.querySelector('.sil-btn').addEventListener('click', () => {
                const task = tasks.find(t => t.id === gorevId);
                if (!task) return;

                const parentList = gorevElementi.closest('.gorev-listesi');
                const sourceDate = parentList.dataset.date;
                const isFromAnaListe = parentList.dataset.day === 'atanmamis';

                // Eğer buton Ana Liste'deyse: GÖREVİ KALICI OLARAK SİL
                if (isFromAnaListe) {
                    if (confirm(`'${task.text}' görevini kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
                        tasks = tasks.filter(t => t.id !== gorevId);
                    } else {
                        return; // Kullanıcı iptal ederse hiçbir şey yapma
                    }
                } 
                // Eğer buton bir günün altındaysa: SADECE O GÜNÜN ATAMASINI KALDIR
                else if (sourceDate) {
                    task.dueDates = task.dueDates.filter(d => d !== sourceDate);
                }
                
                saveTasks();
                renderAll();
            });
            
            // GÖREV METNİNİ DÜZENLEME
            const gorevMetniSpan = gorevElementi.querySelector('.gorev-metni');
            gorevMetniSpan.addEventListener('click', () => { gorevMetniSpan.setAttribute('contenteditable', true); gorevMetniSpan.focus(); });
            gorevMetniSpan.addEventListener('blur', () => {
                gorevMetniSpan.removeAttribute('contenteditable');
                const task = tasks.find(t => t.id === gorevId);
                if (task && task.text !== gorevMetniSpan.textContent.trim()) {
                    task.text = gorevMetniSpan.textContent.trim();
                    saveTasks();
                }
            });
            gorevMetniSpan.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); gorevMetniSpan.blur(); }});
        });
    };
    
    // ---- SÜRÜKLE & BIRAK ----
    let suruklenenGorev = { id: null, sourceDate: null };
    document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('gorev')) {
            suruklenenGorev.id = e.target.getAttribute('data-id');
            suruklenenGorev.sourceDate = e.target.closest('.gorev-listesi').dataset.date || null;
            setTimeout(() => e.target.classList.add('dragging'), 0);
        }
    });

    document.addEventListener('dragend', (e) => {
        const draggingElem = document.querySelector('.dragging');
        if (draggingElem) draggingElem.classList.remove('dragging');
        suruklenenGorev = { id: null, sourceDate: null };
    });

    document.addEventListener('dragover', e => {
        const hedefListe = e.target.closest('.gorev-listesi');
        if (hedefListe) { e.preventDefault(); hedefListe.classList.add('drag-over'); }
    });
    
    document.addEventListener('dragleave', e => {
        const hedefListe = e.target.closest('.gorev-listesi');
        if (hedefListe) { hedefListe.classList.remove('drag-over'); }
    });

    document.addEventListener('drop', e => {
        const hedefListe = e.target.closest('.gorev-listesi');
        if (hedefListe) {
            e.preventDefault();
            hedefListe.classList.remove('drag-over');
            const task = tasks.find(t => t.id === suruklenenGorev.id);
            if (task) {
                const hedefTarih = hedefListe.dataset.date;
                const hedefAnaListeMi = hedefListe.dataset.day === 'atanmamis';

                if (hedefAnaListeMi && suruklenenGorev.sourceDate) {
                    task.dueDates = task.dueDates.filter(d => d !== suruklenenGorev.sourceDate);
                } else if (hedefTarih) {
                    if (!task.dueDates.includes(hedefTarih)) {
                        task.dueDates.push(hedefTarih);
                    }
                }
                saveTasks();
                renderAll();
            }
        }
    });

    // ---- GENEL KONTROL DİNLEYİCİLERİ ----
    gorevEkleBtn.addEventListener('click', addTask);
    gorevInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });
    aramaInput.addEventListener('input', renderAll);
    oncekiHaftaBtn.addEventListener('click', () => { mevcutTarih.setDate(mevcutTarih.getDate() - 7); renderAll(); });
    sonrakiHaftaBtn.addEventListener('click', () => { mevcutTarih.setDate(mevcutTarih.getDate() + 7); renderAll(); });
    
    // ---- VERİ YEDEKLEME ----
    disaAktarBtn.addEventListener('click', () => {
        if(tasks.length === 0) return alert("Dışa aktarılacak görev bulunmuyor.");
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `planlayici_verileri_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    iceAktarBtn.addEventListener('click', () => iceAktarInput.click());
    iceAktarInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    tasks = importedTasks; saveTasks(); renderAll(); alert('Veriler başarıyla içe aktarıldı!');
                } else { alert('Geçersiz dosya formatı.'); }
            } catch (error) { alert('Dosya okunurken bir hata oluştu: ' + error.message); }
        };
        reader.readAsText(file);
        iceAktarInput.value = '';
    });

    // ---- UYGULAMAYI BAŞLAT ----
    renderAll();

}
