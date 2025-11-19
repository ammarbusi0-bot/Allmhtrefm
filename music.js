// نظام الموسيقى والخلفية الصوتية
class BackgroundMusic {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.currentTrack = 0;
        this.volume = 0.4;
        
        this.tracks = [
            { name: "نغمة رومانسية هادئة", url: "https://assets.mixkit.co/music/preview/mixkit-romantic-tender-moment-487.mp3" },
            { name: "موسيقى حب خفيفة", url: "https://assets.mixkit.co/music/preview/mixkit-love-of-my-heart-491.mp3" },
            { name: "أجواء عاطفية", url: "https://assets.mixkit.co/music/preview/mixkit-sad-romantic-melody-491.mp3" }
        ];
        
        this.init();
    }
    
    init() {
        this.createMusicPlayer();
        this.loadTrack(0);
        
        // تشغيل الموسيقى بعد تفاعل المستخدم
        document.addEventListener('click', () => {
            if (!this.isPlaying && this.audio) {
                this.play();
            }
        }, { once: true });
    }
    
    createMusicPlayer() {
        const player = document.createElement('div');
        player.className = 'music-player';
        player.innerHTML = `
            <div class="music-controls">
                <button class="music-btn" onclick="window.musicSystem.toggle()">
                    <i class="fas fa-play"></i>
                </button>
                <div class="music-info">
                    <span class="current-track">${this.tracks[0].name}</span>
                    <div class="music-progress">
                        <div class="progress-bar"></div>
                    </div>
                </div>
                <button class="volume-btn" onclick="window.musicSystem.toggleMute()">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
        `;
        document.body.appendChild(player);
    }
    
    loadTrack(index) {
        this.currentTrack = index;
        try {
            this.audio = new Audio(this.tracks[index].url);
            this.audio.volume = this.volume;
            this.audio.loop = true;
            
            this.audio.addEventListener('ended', () => {
                this.nextTrack();
            });
            
            this.audio.addEventListener('canplaythrough', () => {
                console.log('الموسيقى جاهزة للتشغيل');
            });
            
            this.audio.addEventListener('error', (e) => {
                console.log('خطأ في تحميل الموسيقى:', e);
            });
            
            this.updatePlayerInfo();
        } catch (error) {
            console.log('خطأ في إنشاء المشغل الصوتي');
        }
    }
    
    play() {
        if (this.audio) {
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updatePlayButton();
                this.showMusicNotification();
            }).catch(error => {
                console.log('يتطلب تفاعل المستخدم لتشغيل الصوت');
            });
        }
    }
    
    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton();
        }
    }
    
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    toggleMute() {
        if (this.audio) {
            this.audio.muted = !this.audio.muted;
            const icon = document.querySelector('.volume-btn i');
            icon.className = this.audio.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
    }
    
    nextTrack() {
        let nextIndex = (this.currentTrack + 1) % this.tracks.length;
        this.loadTrack(nextIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    updatePlayButton() {
        const icon = document.querySelector('.music-btn i');
        if (icon) {
            icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }
    
    updatePlayerInfo() {
        const trackElement = document.querySelector('.current-track');
        if (trackElement) {
            trackElement.textContent = this.tracks[this.currentTrack].name;
        }
    }
    
    showMusicNotification() {
        const notification = document.createElement('div');
        notification.className = 'music-notification';
        notification.innerHTML = `
            <i class="fas fa-music"></i>
            <span>تم تشغيل الموسيقى الرومانسية</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// بدء النظام الموسيقي عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.musicSystem = new BackgroundMusic();
    }, 1000);
});
