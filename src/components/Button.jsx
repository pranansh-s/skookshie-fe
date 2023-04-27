const Button = ({ text, click }) => {
    return(
        <button className="bg-primary text-sm hover:bg-secondary text-black hover:text-white px-4 py-2 rounded-r-xl transition-all duration-300" onClick={click}>{text}</button>
    );
}

export default Button;