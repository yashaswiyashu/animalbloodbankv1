import React, { useState } from 'react';
import Modal from 'react-modal';
import './StoriesOfHope.css';
import FooterSection from '../homePage/FooterSection';
import Navbar from '../homePage/Navbar';
import { Home, PawPrint, HeartPulse, CalendarDays, Video } from 'lucide-react';
import croc from './assets/temple_mistry.mp4';
import chota from "./assets/chota_champ.mp4";
import cow from "./assets/cow_farm.mp4";
import cowfarm from "./assets/cow_foreign.mp4";
import preg from "./assets/animal_pregnency.mp4";

const videoFiles = [croc, chota, cow, cowfarm, preg];

const videoData = [
  {
    title: 'Temple Guardian: The Sacred Crocodile of Ananthapura',
    views: '15.1K',
    date: '2 days ago',
    category: 'Rescue Stories',
  },
  {
    title: 'Little Champ’s Big Roar: Puppy Faces Off a Giant Dog',
    views: '12.8K',
    date: '3 days ago',
    category: 'Animal Care Tips',
  },
  {
    title: 'Sacred Cows Abroad: How Other Countries Cherish Their Cattle',
    views: '10.5K',
    date: '4 days ago',
    category: 'Community Events',
  },
  {
    title: 'Farm Friends: Kids Caring for Cows with Love',
    views: '8.8K',
    date: '5 days ago',
    category: 'Behind the Scenes',
  },
  {
    title: 'Saving Hope: Doctors Treat a Pregnant Sea Dog',
    views: '11.2K',
    date: '6 days ago',
    category: 'Rescue Stories',
  },
];
const categories = ['All', 'Rescue Stories', 'Animal Care Tips', 'Community Events', 'Behind the Scenes'];

const StoriesOfHope = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [durations, setDurations] = useState<string[]>(Array(videoFiles.length).fill(''));

  const openModal = (videoSrc: string) => {
    setCurrentVideo(videoSrc);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentVideo(null);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>, index: number) => {
    const duration = e.currentTarget.duration;
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    setDurations(prev => {
      const updated = [...prev];
      updated[index] = formatted;
      return updated;
    });
  };

  const filteredVideos = activeCategory === 'All'
    ? videoData
    : videoData.filter(video => video.category === activeCategory);

  return (
    <>
      <Navbar />
      <div className="stories-container">
        <header className="stories-header">
          <h1>Heartwarming Stories of Hope</h1>
          <p>Watch real stories of rescue, care, and community love. Join us in making a difference in the lives of animals.</p>
        </header>

        <nav className="stories-nav">
          {categories.map(category => {
            let Icon;
            switch (category) {
              case 'All': Icon = Home; break;
              case 'Rescue Stories': Icon = PawPrint; break;
              case 'Animal Care Tips': Icon = HeartPulse; break;
              case 'Community Events': Icon = CalendarDays; break;
              case 'Behind the Scenes': Icon = Video; break;
              default: Icon = Home;
            }
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? 'active' : ''}
              >
                <Icon size={16} style={{ marginRight: '6px', marginBottom: '-2px' }} />
                {category}
              </button>
            )
          })}
        </nav>

        <div className="content-section">
          <div className="video-cards">
            {filteredVideos.map((video, index) => {
              const fileIndex = videoData.findIndex(v => v.title === video.title);
              return (
                <div className="video-card" key={index} onClick={() => openModal(videoFiles[fileIndex])}>
                  <div className="video-thumbnail">
                    <video
                      src={videoFiles[fileIndex]}
                      muted
                      preload="metadata"
                      className="video-preview"
                      onLoadedMetadata={(e) => handleLoadedMetadata(e, fileIndex)}
                    />
                    <span className="duration">{durations[fileIndex]}</span>
                  </div>
                  <h3>{video.title}</h3>
                  <p>{video.views} Views • {video.date}</p>
                </div>
              )
            })}
          </div>

          <div className="trending-videos">
            <h2>Trending Videos</h2>
            {videoData.slice(0, 3).map((video, index) => (
              <div className="trending-card" key={index} onClick={() => openModal(videoFiles[index])}>
                <div className="trending-thumbnail">
                  <video
                    src={videoFiles[index]}
                    muted
                    preload="metadata"
                    className="trending-video-preview"
                    onLoadedMetadata={(e) => handleLoadedMetadata(e, index)}
                  />
                  <span className="trending-duration">{durations[index]}</span>
                </div>
                <div className="trending-info">
                  <h4>{video.title}</h4>
                  <p>{video.views} Views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="video-modal"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
      >
        <button className="close-btn" onClick={closeModal}>×</button>
        {currentVideo && (
          <video src={currentVideo} controls autoPlay className="modal-video" />
        )}
      </Modal>

      <FooterSection />
    </>
  );
};

export default StoriesOfHope;
