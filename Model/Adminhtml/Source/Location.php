<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\Braintree\Model\Adminhtml\Source;

use Magento\Framework\Data\OptionSourceInterface;

class Location implements OptionSourceInterface
{
    /**
     * Possible actions on order place
     *
     * @return array
     */
    public function toOptionArray(): array
    {
        return [
            [
                'value' => 'cart',
                'label' => __('Mini-Cart and Cart Page'),
            ],
            [
                'value' => 'checkout',
                'label' => __('Checkout Page'),
            ],
            [
                'value' => 'productpage',
                'label' => __('Product Page')
            ]
        ];
    }
}
