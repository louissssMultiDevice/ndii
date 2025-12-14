import React, { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import './MusicPlayer.css';

const MusicPlayer = () => {
  // Refs
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const logo3DRef = useRef(null);
  const particlesRef = useRef(null);
  const lyricsContainerRef = useRef(null);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [lyricsMode, setLyricsMode] = useState('box');
  const [isRepeatMode, setIsRepeatMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedLyrics, setSelectedLyrics] = useState([]);
  const [shareView, setShareView] = useState('main');
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);

  // Lyrics data dengan timing akurat
  const lyricsData = useMemo(() => [
    { time: 0, text: "♪" },
    { time: 12, text: "beranjak dari kasur" },
    { time: 17, text: "mendengarkan alur" },
    { time: 22, text: "cerita yang tak luntur" },
    { time: 28, text: "begitu sampai kau hancur" },
    { time: 35, text: "bergegas beranjak dewasa" },
    { time: 38, text: "pikirkan apa yang ada" },
    { time: 41, text: "perihal seribu angan kita" },
    { time: 46, text: "mari raihnya bersama-sama" },
    { time: 49, text: "kita usahakan semua" },
    { time: 52, text: "jangan sampai sia-sia" },
    { time: 56, text: "ku tahu ini berat tuk mencoba" },
    { time: 62, text: "namun, ku tahu kita bisa" },
    { time: 70, text: "ayo, bersama. saling menjaga" },
    { time: 75, text: "ayo, bersama. saling mencinta" },
    { time: 80, text: "ayo, bersama. saling berbagi" },
    { time: 85, text: "ayo, bersama. saling koreksi" },
    { time: 92, text: "hati yang kau temukan ini" },
    { time: 96, text: "hati yang ku temukan ini" },
    { time: 102, text: "sangat susah tuk ditanggapi" },
    { time: 107, text: "namun kita berdua berdiri" },
    { time: 116, text: "menjadi pribadi fiksi" },
    { time: 120, text: "banal semua hal yang terjadi" },
    { time: 125, text: "membakar jiwa dan patah hati" },
    { time: 131, text: "merubahnya menjadi energi" },
    { time: 138, text: "bergegas beranjak dewasa" },
    { time: 141, text: "pikirkan apa yang ada" },
    { time: 144, text: "perihal seribu angan kita" },
    { time: 149, text: "mari raihnya bersama-sama" },
    { time: 152, text: "kita usahakan semua" },
    { time: 153, text: "jangan sampai sia-sia" },
    { time: 159, text: "ku tahu ini berat tuk mencoba" },
    { time: 165, text: "namun, ku tahu kita bisa" },
    { time: 172, text: "ayo, bersama. saling menjaga" },
    { time: 178, text: "ayo, bersama. saling mencinta" },
    { time: 183, text: "ayo, bersama. saling berbagi" },
    { time: 188, text: "ayo, bersama. saling koreksi" },
    { time: 193, text: "ku tak minta kita berpisah" },
    { time: 198, text: "mari kita saling ubah" },
    { time: 203, text: "kesalahan yang t'lah berlalu" },
    { time: 209, text: "ubahlah menjadi abu" },
    { time: 215, text: "hidup dengan penuh suka cita" },
    { time: 240, text: "dan bersama diriku, selamanya..." },
    { time: 243, text: "Lagu By NdiiClouD" }
  ], []);

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Format time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Capitalize words
  const capitalizeWords = (text) => {
    return text.split(' ').map(word => {
      if (word.length === 0) return word;
      const firstChar = word.charAt(0);
      const isSpecialChar = /[^a-zA-Z0-9]/.test(firstChar);
      
      if (isSpecialChar && word.length > 1) {
        return firstChar + word.charAt(1).toUpperCase() + word.slice(2).toLowerCase();
      }
      
      return firstChar.toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  // Update current lyric index
  useEffect(() => {
    if (audioRef.current) {
      const handleTimeUpdate = () => {
        const time = audioRef.current.currentTime;
        setCurrentTime(time);
        
        // Find current lyric
        let newIndex = 0;
        for (let i = lyricsData.length - 1; i >= 0; i--) {
          if (time >= lyricsData[i].time) {
            newIndex = i;
            break;
          }
        }
        
        if (newIndex !== currentLyricIndex) {
          setCurrentLyricIndex(newIndex);
          scrollToActiveLyric(newIndex);
        }
      };

      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [currentLyricIndex, lyricsData]);

  // Scroll to active lyric
  const scrollToActiveLyric = (index) => {
    setTimeout(() => {
      const lyricId = `lyric-${index}`;
      const element = document.getElementById(lyricId);
      if (element && lyricsContainerRef.current) {
        const container = lyricsContainerRef.current;
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        const containerHeight = container.clientHeight;
        
        container.scrollTo({
          top: elementTop - (containerHeight / 2) + (elementHeight / 2),
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Previous/Next lyric
  const prevLyric = () => {
    if (currentLyricIndex > 0 && audioRef.current) {
      audioRef.current.currentTime = lyricsData[currentLyricIndex - 1].time;
      gsap.to('.control-btn', {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    }
  };

  const nextLyric = () => {
    if (currentLyricIndex < lyricsData.length - 1 && audioRef.current) {
      audioRef.current.currentTime = lyricsData[currentLyricIndex + 1].time;
      gsap.to('.control-btn', {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      audioRef.current.currentTime = percentage * duration;
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = previousVolume;
        setVolume(previousVolume);
      } else {
        setPreviousVolume(volume);
        audioRef.current.volume = 0;
        setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  // Handle lyric selection for sharing
  const handleLyricSelect = (index) => {
    const lyricText = lyricsData[index].text;
    const isSelected = selectedLyrics.some(l => l.index === index);

    if (isSelected) {
      setSelectedLyrics(selectedLyrics.filter(l => l.index !== index));
      showNotification('Lirik dihapus!', 'info');
    } else {
      if (selectedLyrics.length >= 5) {
        showNotification('Maksimal hanya bisa memilih 5 lirik!', 'warning');
        return;
      }
      setSelectedLyrics([...selectedLyrics, { index, text: lyricText }]);
      showNotification('Lirik ditambahkan!', 'success');
    }
  };

  // Generate banner
  const generateBanner = () => {
    if (selectedLyrics.length === 0) {
      showNotification('Pilih minimal 1 lirik untuk membuat banner!', 'warning');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0a2463');
    gradient.addColorStop(0.3, '#1e3c8c');
    gradient.addColorStop(0.6, '#3a6bc9');
    gradient.addColorStop(1, '#5a9bf7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Particles effect
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 4;
      const alpha = Math.random() * 0.4;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    // Title
    ctx.font = 'bold 48px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffa36c';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ffa36c';
    ctx.shadowBlur = 20;
    ctx.fillText('NdiiClouD', width / 2, 80);
    ctx.shadowBlur = 0;

    // Decorative line
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, 100);
    ctx.lineTo(width / 2 + 120, 100);
    ctx.strokeStyle = '#a8d0ff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Selected lyrics
    ctx.font = '26px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    
    const startY = 150;
    const lineHeight = 45;
    
    selectedLyrics.forEach((lyric, index) => {
      const y = startY + (index * lineHeight);
      const text = capitalizeWords(lyric.text);
      ctx.fillText(text, width / 2, y);
    });

    // Bottom line
    const lineGradient = ctx.createLinearGradient(50, height - 100, width - 50, height - 100);
    lineGradient.addColorStop(0, 'transparent');
    lineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    lineGradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.moveTo(50, height - 100);
    ctx.lineTo(width - 50, height - 100);
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Link
    ctx.font = '18px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#a8d0ff';
    ctx.textAlign = 'right';
    ctx.fillText('🎵 Dengarkan di: ', width - 50, height - 70);
    
    ctx.font = 'italic 16px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffa36c';
    ctx.fillText('ndiicloud.privhandi.my.id', width - 50, height - 45);

    // Credit
    ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText('Powered By Tim NdiiClouD', 50, height - 45);
    ctx.shadowBlur = 0;

    setShareView('banner');
    showNotification('Banner berhasil dibuat!', 'success');
  };

  // Download banner
  const downloadBanner = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'banner-lirik-ndiicloud.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    showNotification('Banner berhasil diunduh!', 'success');
  };

  // Copy lyrics
  const copyLyrics = () => {
    if (selectedLyrics.length === 0) {
      showNotification('Pilih lirik terlebih dahulu!', 'warning');
      return;
    }
    
    const lyricsText = selectedLyrics.map(item => item.text).join('\n');
    navigator.clipboard.writeText(lyricsText)
      .then(() => showNotification('Lirik berhasil disalin!', 'success'))
      .catch(() => showNotification('Gagal menyalin lirik', 'error'));
  };

  // Download lyrics as text
  const downloadLyrics = () => {
    const lyricsText = lyricsData.map(lyric => lyric.text).join('\n');
    const blob = new Blob([lyricsText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = 'lirik-beranjak-dewasa-ndiicloud.txt';
    link.href = URL.createObjectURL(blob);
    link.click();
    
    showNotification('Lirik berhasil diunduh!', 'success');
  };

  // Share functions
  const shareLink = () => {
    const url = 'https://ndiicloud.privhandi.my.id/musik/beranjak-dewasa';
    
    if (navigator.share) {
      navigator.share({
        title: 'Beranjak Dewasa - NdiiClouD',
        text: 'Dengarkan lagu "Beranjak Dewasa" oleh NdiiClouD dengan lirik interaktif!',
        url: url,
      })
      .then(() => showNotification('Berhasil dibagikan!', 'success'))
      .catch(() => {
        navigator.clipboard.writeText(url);
        showNotification('Link berhasil disalin!', 'success');
      });
    } else {
      navigator.clipboard.writeText(url);
      showNotification('Link berhasil disalin!', 'success');
    }
  };

  const shareToWhatsApp = () => {
    const url = 'https://ndiicloud.privhandi.my.id/musik/beranjak-dewasa';
    const text = `Dengarkan "Beranjak Dewasa" oleh NdiiClouD:\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = 'https://ndiicloud.privhandi.my.id/musik/beranjak-dewasa';
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToTwitter = () => {
    const url = 'https://ndiicloud.privhandi.my.id/musik/beranjak-dewasa';
    const text = 'Dengarkan "Beranjak Dewasa" oleh NdiiClouD';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  // Theme switcher
  const switchTheme = () => {
    const themes = ['blue', 'purple', 'green', 'dark'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setCurrentTheme(nextTheme);
    showNotification(`Tema ${nextTheme} diaktifkan`, 'success');
  };

  // Get lyric status
  const getLyricStatus = (index) => {
    if (index === currentLyricIndex) return 'active';
    if (index < currentLyricIndex) return 'passed';
    return 'future';
  };

  // Render lyrics based on mode
  const renderLyrics = () => {
    return lyricsData.map((lyric, index) => {
      const status = getLyricStatus(index);
      const isSelected = selectedLyrics.some(l => l.index === index);
      const isSelectable = shareView === 'lyrics';

      if (lyricsMode === 'box') {
        return (
          <div
            key={index}
            id={`lyric-${index}`}
            className={`lyric-line ${status} ${isSelectable ? 'selectable' : ''}`}
            onClick={() => {
              if (isSelectable) {
                handleLyricSelect(index);
              } else if (audioRef.current) {
                audioRef.current.currentTime = lyric.time;
              }
            }}
          >
            {isSelectable && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="lyric-checkbox"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <span className="lyrics-text">{lyric.text}</span>
          </div>
        );
      } else {
        return (
          <div
            key={index}
            id={`lyric-${index}`}
            className={`bubble-line ${status} ${isSelectable ? 'selectable' : ''}`}
            onClick={() => {
              if (isSelectable) {
                handleLyricSelect(index);
              } else if (audioRef.current) {
                audioRef.current.currentTime = lyric.time;
              }
            }}
          >
            {isSelectable && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="lyric-checkbox"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <span className="lyrics-text">{lyric.text}</span>
          </div>
        );
      }
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.matches('input, textarea, button, a')) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            prevLyric();
          }
          break;
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            nextLyric();
          }
          break;
        case 'm':
        case 'M':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleMute();
          }
          break;
        case 'r':
        case 'R':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setIsRepeatMode(!isRepeatMode);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentLyricIndex, isMuted, isRepeatMode]);

  // Load audio metadata
  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
        setIsLoading(false);
        gsap.to('.container-main', {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        });
      };

      const handleEnded = () => {
        if (isRepeatMode) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        } else {
          setIsPlaying(false);
        }
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [isRepeatMode]);

  // Initialize animations
  useEffect(() => {
    if (!isLoading) {
      // Animate lyrics entrance
      gsap.from('.lyric-line, .bubble-line', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.03,
        ease: "power2.out"
      });

      // Animate additional buttons
      gsap.from('.additional-btn', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: "back.out(1.7)"
      });

      // Animate music controls
      gsap.from('.music-controls', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.8,
        ease: "power3.out"
      });
    }
  }, [isLoading, lyricsMode]);

  // Handle lyric click animation
  const handleLyricClick = (index) => {
    const element = document.getElementById(`lyric-${index}`);
    if (element) {
      gsap.to(element, {
        scale: 0.95,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <div className={`music-player-container theme-${currentTheme}`}>
      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Memuat Pengalaman Musik Premium...</div>
        </div>
      )}

      {/* Particles Background */}
      <div ref={particlesRef} className="particles-bg"></div>

      {/* Notification */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          <i className={`fas fa-${
            notification.type === 'success' ? 'check-circle' :
            notification.type === 'warning' ? 'exclamation-triangle' :
            notification.type === 'error' ? 'times-circle' : 'info-circle'
          }`}></i>
          {notification.message}
        </div>
      )}

      {/* Main Container */}
      <div className="container-main" style={{ opacity: 0, transform: 'translateY(20px)' }}>
        {/* Header */}
        <div className="header-section">
          <h1 className="song-title">Beranjak Dewasa</h1>
          <p className="artist-name">By NdiiClouD</p>
          
          <div className="play-btn-container">
            <button onClick={togglePlayPause} className="play-btn">
              <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
              {isPlaying ? ' Jeda Musik' : ' Putar Musik dengan Lirik'}
            </button>
          </div>
        </div>

        {/* Lyrics Mode Toggle */}
        <div className="lyrics-toggle">
          <button
            className={`lyrics-toggle-btn ${lyricsMode === 'box' ? 'active' : ''}`}
            onClick={() => setLyricsMode('box')}
          >
            <i className="fas fa-square"></i> Mode Kotak
          </button>
          <button
            className={`lyrics-toggle-btn ${lyricsMode === 'bubble' ? 'active' : ''}`}
            onClick={() => setLyricsMode('bubble')}
          >
            <i className="fas fa-circle"></i> Mode Bubble
          </button>
          <button
            className={`lyrics-toggle-btn ${lyricsMode === 'karaoke' ? 'active' : ''}`}
            onClick={() => setLyricsMode('karaoke')}
          >
            <i className="fas fa-music"></i> Mode Karaoke
          </button>
        </div>

        {/* Additional Buttons */}
        <div className="additional-buttons">
          <button onClick={() => { setShowShareModal(true); setShareView('main'); }} className="additional-btn share-btn">
            <i className="fas fa-share-alt"></i> Share Lirik
          </button>
          <button onClick={shareLink} className="additional-btn link-btn">
            <i className="fas fa-link"></i> Copy Link
          </button>
          <button onClick={downloadLyrics} className="additional-btn download-btn">
            <i className="fas fa-download"></i> Download Lirik
          </button>
          <button onClick={switchTheme} className="additional-btn theme-btn">
            <i className="fas fa-palette"></i> Ganti Tema
          </button>
          <button 
            onClick={() => setShowShareModal(true)} 
            className="additional-btn info-btn"
          >
            <i className="fas fa-info-circle"></i> Info Lagu
          </button>
        </div>

        {/* Content Container */}
        <div className="content-container">
          {/* 3D Logo */}
          <div className="logo-container" ref={logo3DRef}>
            <div className="logo-placeholder">
              <img 
                src="https://files.catbox.moe/pbj9ng.png" 
                alt="Logo NdiiClouD"
                className="logo-image"
              />
              <div className="logo-glow"></div>
            </div>
          </div>

          {/* Lyrics Container */}
          <div 
            className={`lyrics-container lyrics-${lyricsMode}`}
            ref={lyricsContainerRef}
          >
            <h2 className="lyrics-title">
              {lyricsMode === 'box' ? 'LIRIK LAGU' : 
               lyricsMode === 'bubble' ? 'LIRIK BUBBLE' : 'KARAOKE MODE'}
            </h2>
            <div className={`lyrics-content ${lyricsMode}`}>
              {renderLyrics()}
            </div>
          </div>
        </div>

        {/* Music Controls */}
        <div className="music-controls">
          <button onClick={prevLyric} className="control-btn" title="Lirik Sebelumnya">
            <i className="fas fa-step-backward"></i>
          </button>
          
          <button onClick={togglePlayPause} className="control-btn control-play" title="Putar/Jeda">
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
          </button>
          
          <button onClick={nextLyric} className="control-btn" title="Lirik Selanjutnya">
            <i className="fas fa-step-forward"></i>
          </button>
          
          <div className="progress-container" onClick={handleProgressClick}>
            <div 
              className="progress-bar" 
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
            <div className="progress-thumb"></div>
          </div>
          
          <div className="time-info">
            <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
          </div>
          
          <div className="volume-control-container">
            <button 
              onClick={toggleMute}
              className="volume-btn"
              title={isMuted ? "Unmute" : "Mute"}
            >
              <i className={`fas fa-volume-${isMuted ? 'mute' : volume === 0 ? 'mute' : volume < 0.5 ? 'down' : 'up'}`}></i>
            </button>
            
            <button 
              onClick={() => setShowVolumeSlider(!showVolumeSlider)} 
              className="volume-slider-btn"
              title="Volume Control"
            >
              <i className="fas fa-sliders-h"></i>
            </button>
            
            {showVolumeSlider && (
              <div className="volume-slider-container">
                <i className="fas fa-volume-down"></i>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
                <i className="fas fa-volume-up"></i>
                <span className="volume-value">{Math.round(volume * 100)}%</span>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsRepeatMode(!isRepeatMode)} 
            className={`control-btn ${isRepeatMode ? 'active' : ''}`}
            title="Ulangi"
          >
            <i className="fas fa-redo"></i>
          </button>

          <button 
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
                setIsPlaying(true);
              }
            }}
            className="control-btn"
            title="Mulai dari Awal"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>

        {/* Lyrics Navigation */}
        <div className="lyrics-navigation">
          <button 
            onClick={prevLyric}
            className="lyrics-nav-btn"
            disabled={currentLyricIndex === 0}
          >
            <i className="fas fa-chevron-up"></i> Lirik Sebelumnya
          </button>
          <div className="lyrics-counter">
            Lirik {currentLyricIndex + 1} dari {lyricsData.length}
          </div>
          <button 
            onClick={nextLyric}
            className="lyrics-nav-btn"
            disabled={currentLyricIndex === lyricsData.length - 1}
          >
            Lirik Selanjutnya <i className="fas fa-chevron-down"></i>
          </button>
        </div>

        {/* Credits Card */}
        <div className="credits-card">
          <div className="credits-content">
            <h3 className="credits-title">Credits</h3>
            <div className="credits-items">
              <div className="credit-item">
                <i className="fas fa-music"></i>
                <div>
                  <p className="credit-label">Lagu & Lirik</p>
                  <p className="credit-value">NdiiClouD</p>
                </div>
              </div>
              <div className="credit-item">
                <i className="fas fa-code"></i>
                <div>
                  <p className="credit-label">Website Developer</p>
                  <p className="credit-value">Tim NdiiClouD</p>
                </div>
              </div>
              <div className="credit-item">
                <i className="fas fa-palette"></i>
                <div>
                  <p className="credit-label">UI/UX Design</p>
                  <p className="credit-value">Premium Interactive</p>
                </div>
              </div>
              <div className="credit-item">
                <i className="fas fa-headphones"></i>
                <div>
                  <p className="credit-label">Audio Production</p>
                  <p className="credit-value">Studio NdiiClouD</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sponsor */}
        <div className="sponsor">
          <div className="sponsor-content">
            <p className="sponsor-title">Didukung oleh:</p>
            <img 
              src="https://files.catbox.moe/pbj9ng.png" 
              alt="Logo NdiiClouD" 
              className="sponsor-logo"
            />
            <a 
              href="https://ndiicloud.privhandi.my.id/musik/beranjak-dewasa" 
              className="sponsor-link" 
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ndiicloud.privhandi.my.id/musik/beranjak-dewasa
            </a>
            <div className="sponsor-stats">
              <div className="stat-item">
                <i className="fas fa-play-circle"></i>
                <span>10K+ Putaran</span>
              </div>
              <div className="stat-item">
                <i className="fas fa-heart"></i>
                <span>2K+ Likes</span>
              </div>
              <div className="stat-item">
                <i className="fas fa-share"></i>
                <span>500+ Shares</span>
              </div>
            </div>
            <p className="sponsor-credit">Powered By Tim NdiiClouD</p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Share Lirik</h2>
            
            {shareView === 'main' && (
              <>
                <div className="share-options">
                  <button onClick={shareLink} className="share-option-btn">
                    <i className="fas fa-share"></i> Share Link Lagu
                  </button>
                  <button onClick={() => setShareView('lyrics')} className="share-option-btn">
                    <i className="fas fa-quote-right"></i> Share Lirik Pilihan
                  </button>
                  <button onClick={() => setShareView('social')} className="share-option-btn">
                    <i className="fas fa-hashtag"></i> Share ke Media Sosial
                  </button>
                </div>
                
                <div className="modal-buttons">
                  <button onClick={() => setShowShareModal(false)} className="modal-btn secondary">
                    <i className="fas fa-times"></i> Tutup
                  </button>
                </div>
              </>
            )}

            {shareView === 'lyrics' && (
              <>
                <p className="modal-subtitle">Pilih maksimal 5 lirik favorit untuk di-share:</p>
                <div className="selected-lyrics-info">
                  <span>{selectedLyrics.length}/5 lirik terpilih</span>
                  <button 
                    onClick={() => setSelectedLyrics([])}
                    className="clear-selection-btn"
                    disabled={selectedLyrics.length === 0}
                  >
                    <i className="fas fa-trash"></i> Hapus Semua
                  </button>
                </div>
                
                <div className="lyrics-selection-container">
                  {lyricsData.map((lyric, index) => {
                    const isSelected = selectedLyrics.some(l => l.index === index);
                    return (
                      <div
                        key={index}
                        className={`selection-line ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleLyricSelect(index)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="lyric-checkbox"
                        />
                        <span className="lyrics-text">{lyric.text}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="modal-buttons">
                  <button onClick={generateBanner} className="modal-btn primary">
                    <i className="fas fa-image"></i> Buat Banner
                  </button>
                  <button onClick={copyLyrics} className="modal-btn">
                    <i className="fas fa-copy"></i> Copy Lirik
                  </button>
                  <button onClick={() => { setShareView('main'); }} className="modal-btn secondary">
                    <i className="fas fa-arrow-left"></i> Kembali
                  </button>
                </div>
              </>
            )}

            {shareView === 'social' && (
              <>
                <p className="modal-subtitle">Pilih platform untuk berbagi:</p>
                <div className="share-options">
                  <button onClick={shareToWhatsApp} className="share-option-btn whatsapp">
                    <i className="fab fa-whatsapp"></i> WhatsApp
                  </button>
                  <button onClick={shareToFacebook} className="share-option-btn facebook">
                    <i className="fab fa-facebook"></i> Facebook
                  </button>
                  <button onClick={shareToTwitter} className="share-option-btn twitter">
                    <i className="fab fa-twitter"></i> Twitter
                  </button>
                  <button onClick={shareLink} className="share-option-btn link">
                    <i className="fas fa-link"></i> Copy Link
                  </button>
                </div>
                <div className="modal-buttons">
                  <button onClick={() => setShareView('main')} className="modal-btn secondary">
                    <i className="fas fa-arrow-left"></i> Kembali
                  </button>
                </div>
              </>
            )}

            {shareView === 'banner' && (
              <>
                <div className="banner-preview">
                  <canvas ref={canvasRef} width="800" height="400" className="banner-canvas"></canvas>
                  <p className="banner-tip">Banner siap untuk diunduh atau dibagikan!</p>
                </div>
                <div className="modal-buttons">
                  <button onClick={downloadBanner} className="modal-btn primary">
                    <i className="fas fa-download"></i> Download Banner
                  </button>
                  <button onClick={() => { 
                    if (navigator.share) {
                      canvasRef.current.toBlob(blob => {
                        const file = new File([blob], 'banner-lirik-ndiicloud.png', { type: 'image/png' });
                        navigator.share({
                          files: [file],
                          title: 'Banner Lirik NdiiClouD',
                          text: 'Lihat banner lirik dari lagu "Beranjak Dewasa"!',
                        });
                      });
                    } else {
                      downloadBanner();
                    }
                  }} className="modal-btn share">
                    <i className="fas fa-share-alt"></i> Share Banner
                  </button>
                  <button onClick={() => { setShareView('lyrics'); }} className="modal-btn secondary">
                    <i className="fas fa-arrow-left"></i> Kembali
                  </button>
                </div>
              </>
            )}

            {shareView === 'info' && (
              <>
                <div className="song-info">
                  <div className="info-section">
                    <h3>Tentang Lagu</h3>
                    <p>"Beranjak Dewasa" adalah lagu yang bercerita tentang perjalanan menuju kedewasaan, saling menjaga, dan mencintai dalam menghadapi kehidupan.</p>
                  </div>
                  <div className="info-section">
                    <h3>Detail</h3>
                    <ul>
                      <li><strong>Artis:</strong> NdiiClouD</li>
                      <li><strong>Durasi:</strong> 4:03 menit</li>
                      <li><strong>Genre:</strong> Pop, Indie, Lirikal</li>
                      <li><strong>Tahun:</strong> 2024</li>
                      <li><strong>Label:</strong> NdiiClouD Records</li>
                    </ul>
                  </div>
                  <div className="info-section">
                    <h3>Fitur Interaktif</h3>
                    <ul>
                      <li>Lirik dengan timing yang akurat</li>
                      <li>3 mode tampilan lirik</li>
                      <li>Karaoke mode dengan highlight</li>
                      <li>Share lirik dengan banner generator</li>
                      <li>Multiple themes</li>
                      <li>Keyboard shortcuts</li>
                    </ul>
                  </div>
                </div>
                <div className="modal-buttons">
                  <button onClick={() => setShareView('main')} className="modal-btn secondary">
                    <i className="fas fa-arrow-left"></i> Kembali
                  </button>
                  <button onClick={() => setShowShareModal(false)} className="modal-btn primary">
                    <i className="fas fa-check"></i> Oke
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        preload="metadata"
        onError={() => showNotification('Gagal memuat audio', 'error')}
      >
        <source src="https://files.catbox.moe/yg2x02.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicPlayer;
