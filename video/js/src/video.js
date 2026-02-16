function createVideoPlayer() {
    if (typeof video_file === 'undefined' || !video_file) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'video-player-error';
        errorContainer.style.cssText = 'background:#ff4757;color:white;padding:20px;text-align:center;line-height:1.5';
        errorContainer.innerHTML = 'ОШИБКА: Не указан путь к видеофайлу!<br>Убедитесь, что в <script> задана переменная:<br><code style="display:inline-block;margin-top:10px;background:rgba(0,0,0,0.2);padding:5px 10px;border-radius:4px;font-family:monospace">const video_file = "ваш_файл.mp4";</code>';
        document.body.appendChild(errorContainer);
        return;
    }

    const style = document.createElement('style');
    style.textContent = `
        .neon-player {
            position:relative;
            max-width:900px;
            margin:2rem auto;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 15px 35px rgba(0,0,0,0.5);
            background:#0f0f1a;
            transition:transform 0.3s ease
        }
        .neon-player:hover {
            transform:translateY(-5px)
        }
        .neon-player video {
            width:100%;
            display:block;
            background:#000;
            cursor:pointer
        }
        .controls {
            position:absolute;
            bottom:0;
            left:0;
            right:0;
            background:linear-gradient(to top,rgba(15,15,26,0.95),transparent 60%);
            padding:20px;
            display:flex;
            align-items:center;
            gap:15px;
            opacity:0;
            transition:opacity 0.4s ease
        }
        .neon-player:hover .controls {
            opacity:1
        }
        .play-pause {
            width:50px;
            height:50px;
            border-radius:50%;
            background:linear-gradient(135deg,#6a11cb 0%,#2575fc 100%);
            border:none;
            color:white;
            font-size:1.2rem;
            cursor:pointer;
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:0 0 20px rgba(106,17,203,0.4);
            transition:all 0.3s;
            flex-shrink:0
        }
        .play-pause:hover {
            transform:scale(1.1);
            box-shadow:0 0 30px rgba(106,17,203,0.7)
        }
        .progress-container {
            flex:1;
            height:6px;
            background:rgba(255,255,255,0.1);
            border-radius:3px;
            cursor:pointer;
            position:relative
        }
        .progress-bar {
            height:100%;
            background:linear-gradient(to right,#00d2d3,#009efd);
            border-radius:3px;
            width:0%;
            position:relative;
            transition:width 0.1s linear
        }
        .progress-bar::after {
            content:'';
            position:absolute;
            right:-5px;
            top:50%;
            transform:translateY(-50%);
            width:12px;
            height:12px;
            background:white;
            border-radius:50%;
            box-shadow:0 0 10px rgba(0,158,253,0.7)
        }
        .time-display {
            color:#a0a0ff;
            font-size:.9rem;
            min-width:80px;
            text-align:center;
            font-weight:500
        }
        .volume-container {
            display:flex;
            align-items:center;
            gap:8px
        }
        .volume-icon {
            color:#a0a0ff;
            font-size:1.2rem;
            cursor:pointer;
            transition:color .2s;
            padding:2px
        }
        .volume-icon:hover {
            color:#00d2d3
        }
        .volume-slider {
            width:80px;
            -webkit-appearance:none;
            height:5px;
            background:rgba(255,255,255,0.1);
            border-radius:3px;
            outline:none
        }
        .volume-slider::-webkit-slider-thumb {
            -webkit-appearance:none;
            width:14px;
            height:14px;
            border-radius:50%;
            background:#00d2d3;
            cursor:pointer;
            box-shadow:0 0 10px rgba(0,210,211,0.5)
        }
        .volume-slider::-moz-range-thumb {
            width:14px;
            height:14px;
            border-radius:50%;
            background:#00d2d3;
            cursor:pointer;
            box-shadow:0 0 10px rgba(0,210,211,0.5);
            border:none
        }
        .fullscreen-btn {
            background:none;
            border:none;
            color:#a0a0ff;
            font-size:1.3rem;
            cursor:pointer;
            transition:color .2s;
            padding:5px;
            flex-shrink:0
        }
        .fullscreen-btn:hover {
            color:#00d2d3
        }
        .neon-glow {
            position:absolute;
            top:0;
            left:0;
            right:0;
            height:3px;
            background:linear-gradient(90deg,transparent,#00d2d3,#6a11cb,#00d2d3,transparent);
            animation:glow 3s infinite;
            opacity:.7
        }
        @keyframes glow {
            0% {
                transform:translateX(-100%)
            }
            100% {
                transform:translateX(100%)
            }
        }
        .error-message {
            background:#ff4757;
            color:white;
            padding:20px;
            text-align:center;
            line-height:1.5
        }
        .error-message code {
            display:inline-block;
            margin-top:10px;
            background:rgba(0,0,0,0.2);
            padding:5px 10px;
            border-radius:4px;
            font-family:monospace
        }
    `;
    document.head.appendChild(style);

    let playerContainer = document.getElementById('video-player-container');
    if (!playerContainer) {
        playerContainer = document.createElement('div');
        playerContainer.id = 'video-player-container';
        document.body.appendChild(playerContainer);
    }

    playerContainer.innerHTML = `
        <div class="neon-player">
            <div class="neon-glow"></div>
            <video></video>
            <div class="controls">
                <button class="play-pause">▶</button>
                <div class="progress-container">
                    <div class="progress-bar"></div>
                </div>
                <div class="time-display">00:00 / 00:00</div>
                <div class="volume-container">
                    <div class="volume-icon">🔊</div>
                    <input type="range" class="volume-slider" min="0" max="1" step="0.01" value="0.7">
                </div>
                <button class="fullscreen-btn">⛶</button>
            </div>
        </div>
    `;

    const player = playerContainer.querySelector('.neon-player');
    const video = player.querySelector('video');
    const playBtn = player.querySelector('.play-pause');
    const progressBar = player.querySelector('.progress-bar');
    const timeDisplay = player.querySelector('.time-display');
    const volumeIcon = player.querySelector('.volume-icon');
    const volumeSlider = player.querySelector('.volume-slider');
    const fullscreenBtn = player.querySelector('.fullscreen-btn');

    video.src = video_file;
    video.preload = 'auto';
    video.playsInline = true;
    video.addEventListener('contextmenu', e => e.preventDefault());

    let isPlaying = false;

    video.addEventListener('loadedmetadata', () => {
        video.volume = 0.7;
        volumeSlider.value = 0.7;
        timeDisplay.textContent = `00:00 / ${formatTime(video.duration)}`;
    });

    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    function togglePlay() {
        if (isPlaying) {
            video.pause();
            playBtn.innerHTML = '▶';
            playBtn.title = 'Воспроизвести';
        } else {
            video.play();
            playBtn.innerHTML = '❚❚';
            playBtn.title = 'Пауза';
        }
        isPlaying = !isPlaying;
    }

    video.addEventListener('timeupdate', () => {
        const current = formatTime(video.currentTime);
        const duration = formatTime(video.duration);
        timeDisplay.textContent = `${current} / ${duration}`;
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${progress}%`;
    });

    player.querySelector('.progress-container').addEventListener('click', (e) => {
        if (video.readyState < 1) return;
        const width = e.currentTarget.clientWidth;
        const clickX = e.offsetX;
        video.currentTime = (clickX / width) * video.duration;
    });

    volumeSlider.addEventListener('input', function() {
        if (video.readyState < 1) return;
        video.volume = Number(this.value);
        updateVolumeIcon();
    });

    volumeIcon.addEventListener('click', () => {
        if (video.volume > 0) {
            volumeIcon.dataset.prevVolume = video.volume;
            video.volume = 0;
            volumeSlider.value = 0;
        } else {
            const prevVolume = volumeIcon.dataset.prevVolume || 0.7;
            video.volume = Number(prevVolume);
            volumeSlider.value = prevVolume;
        }
        updateVolumeIcon();
    });

    function updateVolumeIcon() {
        if (video.volume === 0) {
            volumeIcon.innerHTML = '🔇';
            volumeIcon.title = 'Включить звук';
        } else if (video.volume < 0.5) {
            volumeIcon.innerHTML = '🔉';
            volumeIcon.title = 'Отключить звук';
        } else {
            volumeIcon.innerHTML = '🔊';
            volumeIcon.title = 'Отключить звук';
        }
    }

    fullscreenBtn.addEventListener('click', () => {
        if (player.requestFullscreen) {
            player.requestFullscreen();
        } else if (player.mozRequestFullScreen) {
            player.mozRequestFullScreen();
        } else if (player.webkitRequestFullscreen) {
            player.webkitRequestFullscreen();
        }
    });

    video.addEventListener('ended', () => {
        playBtn.innerHTML = '↻';
        playBtn.title = 'Начать сначала';
        isPlaying = false;
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    video.addEventListener('error', () => {
        player.innerHTML = `
            <div class="error-message">
                ОШИБКА ЗАГРУЗКИ ВИДЕО: ${video_file}<br><br>
                Проверьте:<br>
                1. Существует ли файл по указанному пути<br>
                2. Доступен ли файл локально<br>
                3. Корректное ли расширение файла (.mp4)
            </div>
        `;
    });

    video.addEventListener('playing', () => {
        if (!isPlaying) {
            isPlaying = true;
            playBtn.innerHTML = '❚❚';
        }
    });
}

document.addEventListener('DOMContentLoaded', createVideoPlayer);
