import Icon from './icon';

const HeaderModal = ({ title, closeModal }: { title: string; closeModal: (isShow: boolean) => void }) => {
    return (
        <div className="flex w-full items-center justify-between">
            <p className="text-lg font-semibold text-[#000000]">{title}</p>
            <Icon onClick={() => closeModal(false)} name="close" className="h-6 w-6 cursor-pointer text-[#BFBFBF]" />
        </div>
    );
};

export default HeaderModal;
