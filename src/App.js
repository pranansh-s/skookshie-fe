import Title from './components/Title';
import SearchBar from './components/SearchBar';
import Playlist from './components/Playlist';

import PlaylistContext from "./utils/PlaylistContext";
import { useState } from 'react';

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [indexCurrent, setIndexCurrent] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [hide, setHide] = useState(true);

  const updateHide = (newBool) => {
    setHide(newBool);
  }

  const updatePlaylist = (newSong) => {
    setPlaylist([...playlist, newSong]);
  }

  const removeSongPlaylist = (index) => {
    let pl = playlist;
    pl.splice(index, 1);
    setPlaylist([...pl]);
    if(index <= indexCurrent) setIndexCurrent(indexCurrent - 1);
    if(pl.length === 0) setIndexCurrent(-1); 
  }

  const updateIndexCurrent = (newIndex) => {
    setIndexCurrent(newIndex);
  }

  const updatePlaying = (newBool) => {
    setPlaying(newBool);
  }

  return (
    <PlaylistContext.Provider value={{playlist, removeSongPlaylist, updatePlaylist , indexCurrent, updateIndexCurrent, playing, updatePlaying, hide, updateHide}}>
      <div className='font-roboto flex'>
        <div className='flex flex-col items-center justify-center md:p-12 p-4 space-y-5 lg:w-3/4 w-full'>
          <Title heading='skookshie'/>
          <SearchBar/>
        </div>
        <Playlist/>
        {hide && <i className="far lg:hidden block fa-2x fa-clipboard absolute right-5 top-5 cursor-pointer" onClick={() => updateHide(false)}></i>}
      </div>
    </PlaylistContext.Provider>
  )
} 

export default App;