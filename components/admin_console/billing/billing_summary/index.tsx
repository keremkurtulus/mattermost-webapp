// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useSelector} from 'react-redux';

import {cloudFreeEnabled} from 'mattermost-redux/selectors/entities/preferences';
import {getSubscriptionProduct, checkHadPriorTrial, getCloudSubscription} from 'mattermost-redux/selectors/entities/cloud';

import {CloudProducts} from 'utils/constants';

import {
    noBillingHistory,
    upgradeFreeTierMattermostCloud,
    lastInvoiceInfo,
    freeTrial,
} from './billing_summary';

import {tryEnterpriseCard, UpgradeToProfessionalCard, ExploreEnterpriseCard} from './upsell_card';

import './billing_summary.scss';

type BillingSummaryProps = {
    isLegacyFree: boolean;
    isFreeTrial: boolean;
    daysLeftOnTrial: number;
    onUpgradeMattermostCloud: () => void;
}

const BillingSummary = ({isLegacyFree, isFreeTrial, daysLeftOnTrial, onUpgradeMattermostCloud}: BillingSummaryProps) => {
    const subscription = useSelector(getCloudSubscription);
    const product = useSelector(getSubscriptionProduct);

    let body = noBillingHistory;

    const isPreTrial = subscription?.is_free_trial === 'false' && subscription?.trial_end_at === 0;
    const hasPriorTrial = useSelector(checkHadPriorTrial);
    const isCloudFreeEnabled = useSelector(cloudFreeEnabled);
    const showTryEnterprise = isCloudFreeEnabled && product?.sku === CloudProducts.STARTER && isPreTrial;
    const showUpgradeProfessional = isCloudFreeEnabled && product?.sku === CloudProducts.STARTER && hasPriorTrial;
    const showExploreEnterprise = isCloudFreeEnabled && product?.sku === CloudProducts.PROFESSIONAL;

    if (showTryEnterprise) {
        body = tryEnterpriseCard;
    } else if (showUpgradeProfessional) {
        body = <UpgradeToProfessionalCard/>;
    } else if (showExploreEnterprise) {
        body = <ExploreEnterpriseCard/>;
    } else if (isFreeTrial) {
        body = freeTrial(onUpgradeMattermostCloud, daysLeftOnTrial);
    } else if (isLegacyFree) {
        body = upgradeFreeTierMattermostCloud(onUpgradeMattermostCloud);
    } else if (subscription?.last_invoice) {
        const invoice = subscription!.last_invoice;
        const fullCharges = invoice.line_items.filter((item) => item.type === 'full');
        const partialCharges = invoice.line_items.filter((item) => item.type === 'partial');
        body = (
            lastInvoiceInfo(invoice, product, fullCharges, partialCharges)
        );
    }

    return (
        <div className='BillingSummary'>
            {body}
        </div>
    );
};

export default BillingSummary;
