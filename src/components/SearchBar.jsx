import React from 'react';
import Button from './Button';
import ListItem from './ListItem';
import Player from './Player';

import { Bars } from 'react-loader-spinner';

const SearchBar = () => {
    let inputText = React.createRef();
    let [spotifyResults, setSpotifyResults] = React.useState(null);
    let [value, setValue] = React.useState(null);
    let [loader, setLoader] = React.useState(false);

    let [name, setName] = React.useState();
    let [artists, setArtists] = React.useState(null);
    let [image, setImage] = React.useState(null);

    const addSong = async(name, providers, display) => {
        setArtists(providers.map(providers => providers.name).join(', '));
        setName(name);
        setImage(display);
    }

    React.useEffect(() => {
        if(value){
            setLoader(true);
            setTimeout(() => {
                let query = value.trim().replace(/\s/g, '+');
                fetch(`/song?search=${query}`)
                    .then(res => res.json())
                    .then(jso => setSpotifyResults(jso.spotify.body.tracks.items))
                    .then(setTimeout(setLoader(false), 1000));
            }, [1000]);
        }
    }, [value]);

    return (
        <div>
            <div className='hidden'>Song has been added to queue.</div>
            <div className='flex justify-center mb-16 md:text-base text-sm'>
                <input className='outline-none rounded-l-xl bg-shadow/10 px-3 placeholder:italic' ref={inputText} type='text' placeholder='Search a song...' spellCheck='false' onKeyDown={(event) => event.key === 'Enter' && setValue(inputText.current.value)}/>
                <Button text='Go' click={() => setValue(inputText.current.value)}/>
            </div>
            {loader ? 
                <div className='absolute lg:left-[40%] left-1/2 top-1/2 lg:-translate-x-[40%] -translate-x-1/2 -translate-y-1/2'><Bars height="80" width="80" color="#4fa94d" visible={true}/></div> :
                <ul className='grid justify-center xl:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4 mb-24'>{(spotifyResults) && spotifyResults.map((spotifyResults) => <ListItem key={spotifyResults.id}  id={spotifyResults.id} name={spotifyResults.name} secondaryInfo={spotifyResults.artists} thumbnail={spotifyResults.album.images[1].url} addS={() => addSong(spotifyResults.name, spotifyResults.artists, spotifyResults.album.images[1].url)}/>)}</ul>}
            <Player title={name} artists={artists} thumbnail={image}/>
        </div>
    );
}

export default SearchBar;