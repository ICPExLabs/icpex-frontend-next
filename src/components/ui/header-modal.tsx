import Icon from './icon';

const HeaderModal = ({
    title,
    isBack,
    onBack,
    closeModal,
}: {
    title: string;
    isBack;
    onBack;
    closeModal: (isShow: boolean) => void;
}) => {
    return (
        <div className="flex w-full items-center justify-between">
            {isBack ? (
                <Icon
                    onClick={onBack}
                    name="back"
                    className="h-[15px] w-4 cursor-pointer text-[#999999] duration-75 hover:text-black"
                />
            ) : (
                <p className="text-lg font-semibold text-[#000000]">{title}</p>
            )}

            <Icon
                onClick={() => closeModal(false)}
                name="close"
                className="h-6 w-6 cursor-pointer text-[#BFBFBF] duration-75 hover:text-black"
            />
        </div>
    );
};

export default HeaderModal;
