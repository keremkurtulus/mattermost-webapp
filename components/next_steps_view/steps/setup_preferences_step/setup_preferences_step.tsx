// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';

import {useDispatch} from 'react-redux';

import {pageVisited, trackEvent} from 'actions/telemetry_actions';
import {getAnalyticsCategory} from 'components/next_steps_view/step_helpers';
import {t} from 'utils/i18n';
import {ModalIdentifiers} from 'utils/constants';
import UserSettingsModal from '../../../user_settings/modal';
import {StepComponentProps} from '../../steps';
import TextCardWithAction from '../text_card_with_action/text_card_with_action';
import {openModal} from 'actions/views/modals';

export default function SetupPreferencesStep(props: StepComponentProps) {
    useEffect(() => {
        if (props.expanded) {
            pageVisited(getAnalyticsCategory(props.isAdmin), 'pageview_enable_notifications');
        }
    }, [props.expanded]);

    const dispatch = useDispatch();

    const onFinish = () => {
        props.onFinish(props.id);
    };

    const onClick = () => {
        trackEvent(getAnalyticsCategory(props.isAdmin), 'click_set_preferences');
        dispatch(openModal({
            modalId: ModalIdentifiers.USER_SETTINGS,
            dialogType: UserSettingsModal,
            dialogProps: {
                onExit: onFinish,
                dialogProps: {isContentProductSettings: true},
            },
        }));
    };

    return (
        <>
            <TextCardWithAction
                cardBodyMessageId={t('next_steps_view.preferenceSetup')}
                cardBodyDefaultMessage={'From your Avatar, set your availability, add a custom status, and manage your profile. Access customize notification preferences, custom theme colors, and more in **Settings**.'}
                buttonMessageId={t('next_steps_view.preferenceSetup.setPreferences')}
                buttonDefaultMessage={'Set Preferences'}
                onClick={onClick}
            />
        </>
    );
}

