import { Tooltip } from '@douyinfe/semi-ui';

const MenuModal = () => {
    return (
        <>
            <Tooltip
                position="bottomRight"
                content={
                    <article>
                        <p>hi bytedance</p>
                        <p>hi bytedance</p>
                    </article>
                }
                trigger="click"
            >
                <div className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center border">menu</div>
            </Tooltip>
        </>
    );
};

export default MenuModal;
