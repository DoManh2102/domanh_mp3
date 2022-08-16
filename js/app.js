
const songs = [
    {
        name: 'Pháo hồng',
        singer: 'Đỗ Mạnh',
        path: './music/phaohong.mp3',
        img: './img/domanh1.jpg'
    },
    {
        name: 'Mẹ anh bắt chia tay',
        singer: 'Miu Le',
        path: './music/ViMeAnhBatChiaTay-MiuLe-7503053.mp3',
        img: './img/meanhbatchiatay.jpg'
    },
    {
        name: '1 Phút',
        singer: 'Đỗ Mạnh',
        path: './music/1-Phut-Andiez.mp3',
        img: './img/1phut.jpg'
    },
    {
        name: 'Pháo tím',
        singer: 'Đỗ Mạnh',
        path: './music/phaohong.mp3',
        img: './img/tuavata.jpg'
    },
    {
        name: 'Pháo xanh',
        singer: 'Đỗ Mạnh',
        path: './music/phaohong.mp3',
        img: './img/avata3.jpg'
    },
    {
        name: 'Pháo vàng',
        singer: 'Đỗ Mạnh',
        path: './music/phaohong.mp3',
        img: './img/avata1.jpg'
    }
]

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const randomBtn = document.getElementById('btn-random');
const repeatBtn = document.getElementById('btn-repeat');
let currentIndex = 0;

function start() {
    // Render list song
    renderPlayList();

    // lắng nghe, xử lý các sự kiện DOM / Event
    handleEvents();

    // load dữ liệu bài hát đầu tiên lên UI
    loadFirstSong()
}
start();

function renderPlayList() {
    let htmls = songs.map((song, index) => {
        return `
            <div class="song ${index === currentIndex ? 'active' : ''}" onclick="clickPlaySong(${index})">
               <div class="song__img" style="background-image: url('${song.img}')"></div>
               <div class="song__body">
                  <div class="song-title">
                    <h3>${song.name}</h3>
                    <p>${song.singer}</p>
                 </div>
             </div>
             <div class="song__option">
                <i class="fa-solid fa-ellipsis"></i>
             </div>
         </div>
        `
    })
    document.getElementById('playlist').innerHTML = htmls.join('')
}



function handleEvents() {
    // xử lý cd to nhỏ
    const cdWidth = $('.cd').css('width')
    const replayceCdWidth = cdWidth.replace('px', '')
    document.onscroll = (() => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        scrollTop = scrollTop.toFixed();
        let newCdWidth = replayceCdWidth - scrollTop;
        $('.cd').css('width', newCdWidth);
        $('.cd').css('opacity', newCdWidth / replayceCdWidth);
    })


    // xử lý CD quay / dừng
    const cdAnimate = document.getElementById('cd__thumb').animate({
        rotate: '360deg',
    }, {
        duration: 10000,
        iterations: Infinity
    });
    cdAnimate.pause();

    // xử lý button play bài hát
    let isPlaying = true;
    $('.btn-toggle-play').click(() => {
        if (isPlaying) {
            audio.play();
        }
        else {
            audio.pause();
        }
    })

    // khi bài hát được play
    audio.onplay = () => {
        $('#play-icon').hide();
        $('#pause').show();
        cdAnimate.play()
        isPlaying = false;
    }

    // khi bài hát bị pause
    audio.onpause = () => {
        $('#play-icon').show();
        $('#pause').hide();
        cdAnimate.pause()
        isPlaying = true;
    }


    // xử lý input tiến độ bài hát
    audio.ontimeupdate = function () {
        if (audio.duration) {
            const progressPercent = Math.round(audio.currentTime / audio.duration * 100);
            $('#progress').attr('value', progressPercent)
        }
    }

    // xử lý tiến độ bài hát khi bị tua
    progress.onchange = (e) => {
        const progressPercent = e.target.value;
        const seekTime = audio.duration / 100 * progressPercent;
        audio.currentTime = seekTime;

        //update lại input tiến độ bài hát
        audio.ontimeupdate = function () {
            const loadProgressPercent = Math.round(audio.currentTime / audio.duration * 100);
            document.getElementById('progress').value = loadProgressPercent;
        }
    }

    // next bài hát
    $('.btn-next').click(() => {
        if ($('#icon-random').attr('class') === 'fa-solid fa-shuffle active') {
            randomSong();
        }
        else {
            nextSong();
        }
        audio.play()
        renderPlayList()
        scroolToActiveSong();
    })

    // lùi bài hát
    $('.btn-back').click(() => {
        if ($('#icon-random').attr('class') === 'fa-solid fa-shuffle active') {
            randomSong();
        }
        else {
            backSong();
        }
        audio.play()
        renderPlayList();
        scroolToActiveSong();
    })

    // xử lý random bài hát
    $('.btn-random').click(() => {
        $('#icon-random').toggleClass('active');
    })

    // xử lý lặp lại bài hát
    $('.btn-repeat').click(() => {
        $('#btn-repeat').toggleClass('activeRepeat');
    })


    // tự chuyển bài hát khi kết thúc
    audio.onended = () => {
        if ($('#icon-random').attr('class') === 'fa-solid fa-shuffle active') {
            randomSong();
        } else if ($('#btn-repeat').attr('class') === 'fa-solid fa-arrow-rotate-right activeRepeat') {
            audio.load();
        }
        else {
            nextSong();

        }
        audio.play()
    }
}


// lấy ra bài hát đầu tiên
function getFirstSong() {
    return songs[currentIndex];
}

// load dữ liệu bài hát đầu tiên lên UI
function loadFirstSong() {
    const firsSong = getFirstSong()
    $('#header-title').html(firsSong.name);
    $('#cd__thumb').css('background-image', 'url(' + firsSong.img + ')');
    $('#audio').attr('src', firsSong.path)
}

// next bài hát
function nextSong() {
    currentIndex++;
    if (currentIndex >= songs.length) {
        currentIndex = 0;
    }
    loadFirstSong();
}

// lùi bài hát
function backSong() {
    if (currentIndex <= 0) {
        currentIndex = songs.length;
    }
    currentIndex--;
    loadFirstSong();
}


// ngẫu nhiên bài hát
function randomSong() {
    let newIndex = '';
    do {
        newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === currentIndex)
    currentIndex = newIndex;
    loadFirstSong();
}

function scroolToActiveSong() {
    const locationSong = $('.song.active').offset();
    const heightScreen = 630;
    if (locationSong.top > heightScreen) {
        $("html, body").animate({ scrollTop: locationSong.top - heightScreen }, 500);
    } else {
        $("html, body").animate({ scrollTop: $(".song.active").scrollTop() }, 500);

    }
}

function clickPlaySong(index) {
    currentIndex = index;
    loadFirstSong();
    audio.play();
    renderPlayList();
}






