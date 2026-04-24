const MOCK_ORDERS = [
  {
    order_id: 1,
    book_id: 3,
    buyer_id: 101,
    seller_id: 103,
    order_status: "FINISHED",
    order_time: "2023-12-10 09:30:00",
    finish_time: "2023-12-12 14:00:00"
  },
  {
    order_id: 2,
    book_id: 6,
    buyer_id: 102,
    seller_id: 106,
    order_status: "FINISHED",
    order_time: "2023-12-01 10:20:00",
    finish_time: "2023-12-03 16:30:00"
  },
  {
    order_id: 3,
    book_id: 1,
    buyer_id: 104,
    seller_id: 101,
    order_status: "PENDING",
    order_time: "2024-01-20 11:10:00",
    finish_time: null
  },
  {
    order_id: 4,
    book_id: 2,
    buyer_id: 105,
    seller_id: 102,
    order_status: "CANCELED",
    order_time: "2024-02-05 15:40:00",
    finish_time: null
  },
  {
    order_id: 5,
    book_id: 4,
    buyer_id: 106,
    seller_id: 104,
    order_status: "PENDING",
    order_time: "2024-01-25 08:20:00",
    finish_time: null
  },
  {
    order_id: 6,
    book_id: 5,
    buyer_id: 103,
    seller_id: 105,
    order_status: "CANCELED",
    order_time: "2024-02-15 13:10:00",
    finish_time: null
  }
];