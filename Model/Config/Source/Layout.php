<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\Braintree\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class Layout implements OptionSourceInterface
{
    /**
     * Options getter
     *
     * @return array
     */
    public function toOptionArray(): array
    {
        return [
            [
                'value' => 'vertical',
                'label' => __('Vertical'),
            ],
            [
                'value' => 'horizontal',
                'label' => __('Horizontal'),
            ]
        ];
    }
}
