<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\Braintree\Block\System\Config\Form\Field;

use Magento\Config\Block\System\Config\Form\Field;
use Magento\Framework\Data\Form\Element\AbstractElement;

class RequiresStatus extends Field
{
    /**
     * Reset 'Requires' CSS Class
     *
     * @param AbstractElement $element
     * @return string
     */
    public function render(AbstractElement $element)
    {
        if (str_contains($element->getClass(), 'braintree_ach_direct_debit_')) {
            $requiresClass = str_replace('braintree_ach_direct_debit_', '', $element->getClass());
            $element->setClass($requiresClass);
        }
        if (str_contains($element->getClass(), 'braintree_applepay_')) {
            $requiresClass = str_replace('braintree_applepay_', '', $element->getClass());
            $element->setClass($requiresClass);
        }
        if (str_contains($element->getClass(), 'braintree_local_payment_')) {
            $requiresClass = str_replace('braintree_local_payment_', '', $element->getClass());
            $element->setClass($requiresClass);
        }

        return parent::render($element);
    }
}
