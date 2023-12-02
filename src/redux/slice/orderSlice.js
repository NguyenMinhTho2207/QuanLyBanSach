import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user_id: '',
    note: '',
    shipping_address: '',
    payment_method: '',
    shipping_price: 0,
    total_price: 0,
    is_paid: false,
    paid_at: '',
    is_delivered: false,
    orderItems: [],
    orderItemsSelected: []
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product_id === orderItem.product_id);

            if (itemOrder) {
                itemOrder.quantity += orderItem?.quantity;
                itemOrder.subtotal = orderItem?.unit_price * itemOrder.quantity;
            }
            else {
                state.orderItems.push(orderItem);
            }
        },
        increaseQuantity: (state, action) => {
            const { product_id } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product_id === product_id);
            const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product_id === product_id);
            itemOrder.quantity++;
            itemOrder.subtotal = itemOrder?.unit_price * itemOrder?.quantity;

            if (itemOrderSelected) {
                itemOrderSelected.quantity++;
                itemOrderSelected.subtotal = itemOrderSelected?.unit_price * itemOrderSelected?.quantity;
            }
        },
        decreaseQuantity: (state, action) => {
            const { product_id } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product_id === product_id);
            const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product_id === product_id);
            itemOrder.quantity--;
            itemOrder.subtotal = itemOrder?.unit_price * itemOrder?.quantity;

            if (itemOrderSelected) {
                itemOrderSelected.quantity--;
                itemOrderSelected.subtotal = itemOrderSelected?.unit_price * itemOrderSelected?.quantity;
            }
        },
        removeOrderProduct: (state, action) => {
            const { product_id } = action.payload;
            const itemOrder = state?.orderItems?.filter((item) => item?.product_id !== product_id);
            const itemOrderSelected = state?.orderItemsSelected?.filter((item) => item?.product_id !== product_id);
            state.orderItems = itemOrder;
            state.orderItemsSelected = itemOrderSelected;
        },
        removeAllOrderProduct: (state, action) => {
            const { listChecked } = action.payload;
            const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.product_id));
            const itemOrderSelected = state?.orderItemsSelected?.filter((item) => !listChecked.includes(item.product_id));
            state.orderItems = itemOrders;
            state.orderItemsSelected = itemOrderSelected;
        },
        selectedOrder: (state, action) => {
            const {listChecked} = action.payload;
            const orderSelected = []
            state.orderItems.forEach((order) => {
                if(listChecked.includes(order.product_id)){
                    orderSelected.push(order);
                };
            });
            state.orderItemsSelected = orderSelected;
        },
        resetOrder: (state) => {
            return initialState;
        }
    },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct, increaseQuantity, decreaseQuantity, removeOrderProduct, removeAllOrderProduct, selectedOrder, resetOrder } = orderSlice.actions

export default orderSlice.reducer