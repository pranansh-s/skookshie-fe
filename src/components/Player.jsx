import React, { useContext, useRef, useState } from 'react';
import PlaylistContext from '../utils/PlaylistContext';

class Song {
    constructor(name, artists, img) {
        this.name = name;
        this.artists = artists;
        this.img = img;
    }
}

const Player = ({ title, artists, thumbnail }) => {
    const { playlist, updatePlaylist, indexCurrent, updateIndexCurrent, playing, updatePlaying } = useContext(PlaylistContext);

    let [currentSong, setCurrentSong] = useState(null);
    let audioPlayer = useRef();
    let musicSeeker = useRef();

    let [currentTime, setCurrentTime] = useState('0:00');
    let [totalTime, setTotalTime] = useState('0:00');
    
    //media buffering todo:add to another seperate file
    let chunks = [];
    let [controller, setController] = React.useState();
    let [med, setMed] = React.useState(null);
    let [sourceBuffer, setSourceBuffer] = React.useState(null);
    let [readable, setReadable] = React.useState(null);

    const appendToSourceBuffer = () => {
        if (med.readyState === "open" && sourceBuffer && sourceBuffer.updating === false){
            try {
                sourceBuffer.onupdateend = appendToSourceBuffer;
                sourceBuffer.appendBuffer(chunks.shift());
            } catch (e) {return}
            // console.log(chunks);
        }
    }

    React.useEffect(() => {
        if(med){
            audioPlayer.current.src = URL.createObjectURL(med);
            audioPlayer.current.load();
            audioPlayer.current.play().catch(e => {return});

            musicSeeker.current.addEventListener('change', () => {
                audioPlayer.current.currentTime = musicSeeker.current.value;
                setCurrentTime(msTos(musicSeeker.current.value));
            });
            audioPlayer.current.addEventListener('loadedmetadata', () => {
                musicSeeker.current.max = Math.floor(audioPlayer.current.duration);
                setTotalTime(msTos(audioPlayer.current.duration));
            });
            audioPlayer.current.addEventListener('timeupdate', () => {
                musicSeeker.current.value = Math.floor(audioPlayer.current.currentTime);
                setCurrentTime(msTos(audioPlayer.current.currentTime));

                if(currentTime === totalTime) nextSong();
            });

            med.addEventListener("sourceopen", function() {
                setSourceBuffer(med.addSourceBuffer("audio/mp4; codecs=\"mp4a.40.2\""));
            });
        }
    }, [med]);

    const reader = () => {
        readable.read().then(({ done, value }) => {
            if(done) return;
            chunks.push(value);
            appendToSourceBuffer();
            return reader();
        });
    }

    React.useEffect(() => {
        if(readable) reader();
    }, [readable]);


    document.addEventListener('keydown', (e) =>{
        if(e.keyCode === 32){
            if(e.target === document.body) e.preventDefault();
            if(e.target !== document.querySelector('input[type=text]')) toggleClick();
        }
    });

    React.useEffect(() => {
        if(title){
            const addedSong = new Song(title, artists, thumbnail);
            updatePlaylist(addedSong);
        }
    }, [title]);

    React.useEffect(() => { 
        if(currentSong){
            //init search
            chunks = [];
            if(sourceBuffer && sourceBuffer.updating === true) sourceBuffer.abort();

            let mediaSource = new MediaSource();
            setMed(mediaSource);

            let contr = new AbortController(); 
            setController(contr);

            updatePlaying(true);
        }
    }, [currentSong]);

    React.useEffect(() => {
        if(controller){
            fetch(`/youtube?search=${encodeURIComponent(currentSong.name)}+${encodeURIComponent(currentSong.artists)}`, { signal: controller.signal })
                .then(r => r.body.getReader())
                .then(r => setReadable(r));
        }
    }, [controller])

    React.useEffect(() => {
        if(playlist.length == 1) nextSong();
    }, [playlist]);

    const nextSong = () => {
        if(indexCurrent !== playlist.length - 1) updateIndexCurrent(indexCurrent + 1);
        else musicSeeker.current.value = 0;
    }

    const prevSong = () => {
        if(indexCurrent !== 0) updateIndexCurrent(indexCurrent - 1);
        else musicSeeker.current.value = 0;
    }

    const msTos = (durationSong) => {
        const minutes = Math.floor(durationSong / 60);
        const seconds = Math.floor(durationSong % 60);
        const secStr = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${secStr}`;
    }

    const toggleClick = () => {
        if(currentSong){
            if(!playing && audioPlayer.current.paused) audioPlayer.current.play();
            else audioPlayer.current.pause();

            updatePlaying(!playing);
        }
    }
    
    React.useEffect(() => {
        setCurrentSong(playlist[indexCurrent]);
    }, [indexCurrent]);

    return(
        <div className='fixed bottom-0 left-0 w-full flex justify-between items-center h-24 bg-primary outline outline-1 outline-shadow z-50'>
            {currentSong && 
            <>
                <img className='h-full p-2' src={currentSong.img}/>
                <div className='flex flex-col mr-auto ml-3 md:w-1/6 w-1/2'>
                    <span className='font-varela text-ellipsis whitespace-nowrap overflow-hidden'>{currentSong.name}</span>
                    <span className='text-ellipsis text-sm overflow-hidden whitespace-nowrap'>{currentSong.artists}</span>
                </div>
                
                <div className='flex flex-col space-y-2 items-center justify-center md:absolute md:left-1/2 left-full top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 static md:my-0 my-auto mr-10'>
                    <div className='flex space-x-3'>
                        <i className='fas fa-2x fa-angle-double-left cursor-pointer active:text-black/60'  onClick={prevSong}></i>
                        <i className={`playIcon fas fa-2x fa-${!playing ? 'play' : 'pause'} cursor-pointer active:text-black/60`} onClick={toggleClick}></i>
                        <i className='fas fa-2x fa-angle-double-right cursor-pointer active:text-black/60' onClick={nextSong}></i>
                    </div>
                    <div className='flex space-x-3 text-xs'>
                        <span className='md:block hidden'>{currentTime}</span>
                        <input value={audioPlayer.current && audioPlayer.current.currentTime} className='md:w-[35vw] outline outline-2 outline-secondary appearance-none overflow-hidden lg:bg-white bg-transparent lg:accent-secondary accent-white rounded-lg h-3 w-screen md:relative md:left-0 md:-translate-x-0 md:top-0 absolute left-1/2 top-0 md:translate-y-0 -translate-y-1/2 -translate-x-[calc(50%+10px)] cursor-pointer' type="range" ref={musicSeeker}/>
                        <span className='md:block hidden'>{totalTime}</span>
                        <audio autoPlay ref={audioPlayer} preload='metadata'></audio>
                    </div>
                </div>
            </>}
        </div>
    );
}

export default Player;