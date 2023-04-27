const ListItem = ({ name, secondaryInfo, thumbnail, addS, id }) => {
    let artists = secondaryInfo.map(secondaryInfo => secondaryInfo.name).join(', ');
    return(
        <div className="flex flex-col group cursor-pointer relative">
            <div className="relative">
                <img src={thumbnail} alt={name}/>
                <div onClick={addS} className='w-full h-full group-hover:opacity-70 opacity-0 transition-all duration-300 absolute top-0 bg-secondary flex items-center justify-center'>
                    <i id={id} className="fas fa-2x fa-play h-max cursor-pointer text-white"></i>
                </div>
            </div>
            <div className="flex flex-col h-max p-2">
                <span className='text-ellipsis whitespace-nowrap overflow-hidden text-base font-bold'>{name}</span>
                <span className='text-ellipsis whitespace-nowrap overflow-hidden text-xs text-black/80 font-thin'>{artists}</span>
            </div>
        </div>
    );
}

export default ListItem;