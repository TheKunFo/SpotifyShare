import './ModalFormInput.css';

export default function ModalFormInput({
    isOpen,
    onClose,
    title,
    classForm,
    classButton,
    titleButton,
    onSubmit,
    children
}) {
    if (!isOpen) return null;

    return (
        <div className="modalFormInput__overlay" onClick={onClose}>
            <div className="modalFormInput__content" onClick={e => e.stopPropagation()}>
                <button className="modalFormInput__close" onClick={onClose}>✖</button>
                <div className="modalFormInput__header">
                    <h2>Spotify <span>Playlist Share</span></h2>
                    <h2>{title}</h2>
                </div>
                <form className={classForm} onSubmit={onSubmit}>
                    {children}
                    <button type="submit" className={classButton}>{titleButton}</button>
                </form>
            </div>
        </div>
    );
}
