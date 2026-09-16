import React from 'react';
import { observer } from 'mobx-react-lite';
import { NOTIFICATION_TYPE } from '@/components/bot-notification/bot-notification-utils';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import Button from '../shared_ui/button';

const LocalFooter = observer(() => {
    const { load_modal, dashboard } = useStore();
    const {
        is_open_button_loading,
        is_open_button_disabled,
        loadStrategyOnBotBuilder,
        setLoadedLocalFile,
        saveStrategyToLocalStorage,
        toggleLoadModal,
    } = load_modal;
    const { setOpenSettings, setPreviewOnPopup } = dashboard;
    const { isDesktop } = useDevice();
    const Wrapper = isDesktop ? React.Fragment : Button.Group;

    const handleOpen = async () => {
        try {
            // The imported strategy must be committed to the live workspace before
            // the modal is closed or the temporary import state is cleared.
            await loadStrategyOnBotBuilder();
            await saveStrategyToLocalStorage();

            setLoadedLocalFile(null);
            toggleLoadModal();
            setPreviewOnPopup(false);
            setOpenSettings(NOTIFICATION_TYPE.BOT_IMPORT);
        } catch (error) {
            // Import/load errors are expected to be handled as bot-import failures,
            // not allowed to become unhandled promise rejections that can take down
            // the React tree and show the generic "Sorry for the interruption" page.
            console.error('Failed to open imported bot:', error);
        }
    };

    return (
        <Wrapper>
            {!isDesktop && (
                <Button text={localize('Cancel')} onClick={() => setLoadedLocalFile(null)} has_effect secondary large />
            )}
            <Button
                text={localize('Open')}
                onClick={handleOpen}
                is_loading={is_open_button_loading}
                has_effect
                primary
                large
                disabled={is_open_button_disabled}
            />
        </Wrapper>
    );
});

export default LocalFooter;
