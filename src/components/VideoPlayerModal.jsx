import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, X, SkipForward, Settings, Layers, MessageSquare, Gauge } from 'lucide-react';

export default function VideoPlayerModal({ movie, onClose }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [selectedQuality, setSelectedQuality] = useState('4K Ultra HD');
  const [audioTrack, setAudioTrack] = useState('English (Original 5.1)');
  const [subtitleTrack, setSubtitleTrack] = useState('English [CC]');

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showToast, setShowToast] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState(movie?.episodes ? movie.episodes[0] : null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [movie, selectedEpisode, playbackSpeed]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const skipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 85, duration);
      triggerToast('Skipped Intro (+85s)');
    }
  };

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 2000);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const currentVideoSrc = selectedEpisode?.videoUrl || movie?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
  const displayTitle = selectedEpisode ? `${movie?.title || 'Nebulax Title'} - ${selectedEpisode.title}` : (movie?.title || 'Nebulax Stream');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} title="Close Player">
          <X size={22} />
        </button>

        {/* Video Viewport Wrapper (Isolates player controls to video screen only) */}
        <div className="video-viewport-wrapper">
          {/* Video Overlay Top Title */}
          <div className="player-top-header">
            <div className="player-title-badge">
              <span className="live-dot" />
              <span className="player-title-text">{displayTitle}</span>
            </div>
            <button className="skip-intro-btn" onClick={skipIntro}>
              <SkipForward size={16} /> Skip Intro
            </button>
          </div>

          {/* Toast Notification */}
          {showToast && (
            <div className="player-toast-overlay">
              {showToast}
            </div>
          )}

          {/* Settings Popup Modal */}
          {showSettingsMenu && (
            <div className="player-settings-popup glass-panel">
              <div className="settings-popup-header">
                <span>Audio & Subtitles</span>
                <button onClick={() => setShowSettingsMenu(false)}><X size={16} /></button>
              </div>
              
              <div className="popup-section">
                <label>Audio Track</label>
                {['English (Original 5.1)', 'Spanish (Atmos)', 'Indonesian', 'Japanese'].map((aud) => (
                  <div 
                    key={aud} 
                    className={`popup-item ${audioTrack === aud ? 'selected' : ''}`}
                    onClick={() => { setAudioTrack(aud); triggerToast(`Audio: ${aud}`); }}
                  >
                    {aud}
                  </div>
                ))}
              </div>

              <div className="popup-section">
                <label>Subtitles</label>
                {['English [CC]', 'Indonesian', 'Spanish', 'Off'].map((sub) => (
                  <div 
                    key={sub} 
                    className={`popup-item ${subtitleTrack === sub ? 'selected' : ''}`}
                    onClick={() => { setSubtitleTrack(sub); triggerToast(`Subtitles: ${sub}`); }}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            src={currentVideoSrc}
            className="video-screen"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            autoPlay
          />

          {/* Subtitles Overlay Preview */}
          {subtitleTrack !== 'Off' && (
            <div className="subtitles-overlay-text">
              [ {selectedEpisode ? selectedEpisode.title : movie?.title || 'Nebulax Stream'} ]
            </div>
          )}

          {/* Video Overlay Controls Bar */}
          <div className="player-controls-bar">
            {/* Time Scrubber */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="player-scrubber-track"
              style={{
                background: `linear-gradient(to right, var(--accent-purple) ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / (duration || 1)) * 100}%)`
              }}
            />

            <div className="player-buttons-row">
              <div className="player-left-group">
                <button className="player-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                </button>

                <button className="player-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
                  {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>

                <div className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="player-right-group">
                {/* Audio & Subtitles button */}
                <button 
                  className="player-btn" 
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)} 
                  title="Audio & Subtitles"
                >
                  <MessageSquare size={20} />
                </button>

                {/* Playback speed toggle */}
                <select 
                  className="player-speed-select"
                  value={playbackSpeed}
                  onChange={(e) => {
                    const spd = parseFloat(e.target.value);
                    setPlaybackSpeed(spd);
                    triggerToast(`Speed: ${spd}x`);
                  }}
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1.0}>1.0x (Normal)</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2.0}>2.0x</option>
                </select>

                {/* Quality indicator */}
                <div className="quality-pill" onClick={() => triggerToast(`Quality set to ${selectedQuality}`)}>
                  {selectedQuality}
                </div>

                <button className="player-btn" onClick={toggleFullscreen} title="Fullscreen">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes Selector for Multi-Episode Content (Placed below video viewport in document flow) */}
        {movie?.episodes && (
          <div className="episodes-drawer">
            <div className="episodes-title">Episodes ({movie.episodes.length})</div>
            <div className="episodes-list">
              {movie.episodes.map((ep) => (
                <div
                  key={ep.id}
                  className={`episode-card ${selectedEpisode?.id === ep.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedEpisode(ep);
                    triggerToast(`Playing ${ep.title}`);
                  }}
                >
                  <img src={ep.thumbnail} alt={ep.title} className="episode-thumb" />
                  <div className="episode-details">
                    <div className="episode-number">{ep.duration}</div>
                    <div className="episode-name">{ep.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
