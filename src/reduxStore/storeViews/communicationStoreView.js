export const communicationStoreView = {
  getEmailSubjectAndReason
};

function getEmailSubjectAndReason () {
  return EMAIL_SUBJECTS_AND_REASONS;
}

const EMAIL_SUBJECTS_AND_REASONS = [
  {
    id: 'onlineorder',
    content: 'Online Ordering',
    reasons: [{
      id: 'Help with Specific Item',
      content: 'Information about item (length, color, design)'
    }, {
      id: 'Sizes Not Avail Online',
      content: 'My sizes are not available online'
    }, {
      id: 'International Shipping Inquiry',
      content: 'Do you ship internationally?'
    }]
  },
  {
    id: 'promotions',
    content: 'Promotions/Coupons',
    reasons: [
      {
        id: 'Webcode Problem',
        content: 'My online webcode is not working.'
      },
      {
        id: 'Price Adj Request',
        content: 'What is your price adjustment policy?'
      },
      {
        id: 'Add To Email List',
        content: 'How can I receive promotions and discounts?'
      },
      {
        id: 'Place Cash general inquiry',
        content: 'I have a question about Place Cash'
      },
      {
        id: 'Did Not Get Points From In Store Transaction',
        content: 'I am missing points from an in store transaction'
      },
      {
        id: 'Did Not Get Points From Online Transaction',
        content: 'I am missing points from an online order'
      }
    ]
  },
  {
    id: 'productinquiry',
    content: 'Product Inquiry/Comments',
    reasons: [
      {
        id: 'FEEDBACK',
        content: 'I want to provide feedback regarding your products.'
      }
    ]
  },
  {
    id: 'orderstatus',
    content: 'Order Status', // When selected, two additional optional fields should be displayed underneath the subject drop-down. They are: 1) "Online Order Number" 2) "Original Tracking Number"
    reasons: [
      {
        id: 'Did Not Get Email Confirmation',
        content: 'I did not receive an order confirmation/ship confirmation email.'
      },
      {
        id: 'Modify Or Cancel My Order',
        content: 'Can I modify/cancel my order?'
      },
      {
        id: 'When Will Order Leave the DC',
        content: 'When will my order ship?'
      },
      {
        id: 'Order Canceled By Loss Prevention',
        content: 'Why was my order canceled?'
      },
      {
        id: 'When Will Order Arrive',
        content: 'My order was shipped but not yet received.'
      }
    ]
  },
  {
    id: 'returns',
    content: 'Returns', // When selected, an additional optional field should be displayed underneath the subject drop-down. it is "Online Order Number"
    reasons: [
      {
        id: 'Online Return Policy',
        content: 'How do I return my online order?'
      },
      {
        id: 'Have not Received My Credit',
        content: 'Can you provide me with the status of my returned order?'
      }
    ]
  },
  {
    id: 'store',
    content: 'Store Experience', // When selected, an additional optional field should be displayed underneath the subject drop-down. it is "Store Name / Address"
    reasons: [
      {
        id: 'General Store Complaint',
        content: 'I want to provide feedback regarding my in store experience.'
      }
    ]
  },
  {
    id: 'myPlaceRewards',
    content: 'MyPLACE Rewards Credit Card',
    reasons: [
      {
        id: 'MyPLACE Rewards Credit Card',
        content: 'MyPLACE Rewards Credit Card Inquiry'
      }
    ]
  },
  {
    id: 'airmiles',
    content: 'Airmiles',
    reasons: [
      {
        id: 'I have questions about the AIR MILES Reward Program',
        content: 'I have questions about the AIR MILES Reward Program'
      }
    ]
  },
  {
    id: 'merchandise',
    content: 'Gift Card/Merchandise Credit',
    reasons: [
      {
        id: 'Online Gift Card Problem',
        content: 'I\'m having a problem/issue with my gift card'
      },
      {
        id: 'Merch Credit Problem Or Issue',
        content: 'I\'m having a problem/issue with my merchandise credit.'
      }
    ]
  },
  {
    id: 'technical',
    content: 'Technical Assistance', // When selected, an additional optional field should be displayed underneath the subject drop-down. it is "Gift Card Number or Merchandise Credit Number"
    reasons: [
      {
        id: 'Received A Specific Error Message',
        content: 'I received an error message.'
      },
      {
        id: 'Can Not Complete Online Order',
        content: 'I am unable to place my order.'
      },
      {
        id: 'Forgot Online Password',
        content: 'I forgot my username/password.'
      }
    ]
  },
  {
    id: 'other',
    content: 'Other',
    reasons: [
      {
        id: 'Ecom Miscellaneous Issue',
        content: 'I have a question about something else'
      }
    ]
  }
];
