import { useContext, useState } from "react";
import PlaylistContext from "../utils/PlaylistContext";
import Lottie from "lottie-react";
import notPlaying from "../lottie-audio.svg";
import animationData from "../lottie-audio.json";

const Playlist = () => {
  const {playlist, removeSongPlaylist, indexCurrent, playing, hide, updateHide} = useContext(PlaylistContext);
  return (
    <div className={`${hide ? 'hidden' : 'block'} lg:block lg:w-1/4 w-full bg-secondary h-[calc(100vh-6rem)] right-0 fixed p-8 lg:rounded-l-md lg:rounded-none rounded-none rounded-t-md text-white font-varela`}>
      <h3 className="text-sm text-white/60">Currently Playing</h3>
      {indexCurrent >= 0 && <span className="text-lg inline-block">{playlist[indexCurrent].name}</span>}
      <i className="fa fa-times lg:hidden block absolute right-5 top-5 cursor-pointer p-2" onClick={() => updateHide(true)}></i>
      <hr className="mt-3 mb-6" />
      <ul className="font-roboto">
        {playlist.map((song, index) => 
          <li key={index}  className="flex bg-secondary hover:bg-primary/10 group transition-all rounded-sm duration-300 items-center h-12 z-50">
            <div className="w-10 mx-3">
              {(indexCurrent == index && playing) ? 
                <Lottie
                  loop={true}
                  autoplay={true}
                  animationData={animationData}
                  height={150}
                  width={150}
                /> : 
                <img src={notPlaying} className="p-2"/>}
            </div>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">{song.name}</span>
            <i onClick={() => removeSongPlaylist(index)} className='fas hidden group-hover:block fa-trash cursor-pointer ml-auto mr-3 active:text-black/60'></i>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Playlist;