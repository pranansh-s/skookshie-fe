const Title = ({ heading }) => {
    return(
        <div className="font-varela font-bold md:text-[5rem] sm:text-[4rem] text-[3.5rem] relative group flex justify-center cursor-pointer">
            :&gt; <h1 className="group-hover:-mt-2 group-hover:mb-2 group-hover:drop-shadow-3xl drop-shadow-sm transition-all duration-300 overflow-hidden w-0 animate-title">{heading}</h1> &lt;:
        </div>
    );
}

export default Title;