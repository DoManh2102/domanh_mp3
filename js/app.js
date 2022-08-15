
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
const progress = document.getElementById('progress')
let currentIndex = 0;

function start() {
    // Render list song
    renderPlayList();

    // lắng nghe, xử lý các sự kiện DOM / Event
    handleEvents();

    // load dữ liệu bài hát đầu tiên lên UI
    loadFirstSong()

    // next bài hát
    $('.btn-next').click(() => {
        nextSong();
        audio.play()
    })

    // lùi bài hát
    $('.btn-back').click(() => {
        backSong();
        audio.play()
    })
}
start();

function renderPlayList() {
    let htmls = songs.map((song) => {
        return `
            <div class="song">
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
    }

}


// lấy ra bài hát đầu tiên
function getFirstSong() {
    return songs[currentIndex];
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


// load dữ liệu bài hát đầu tiên lên UI
function loadFirstSong() {
    const firsSong = getFirstSong()
    $('#header-title').html(firsSong.name);
    $('#cd__thumb').css('background-image', 'url(' + firsSong.img + ')');
    $('#audio').attr('src', firsSong.path)
}