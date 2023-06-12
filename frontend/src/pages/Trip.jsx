import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { orederService } from "../services/order.service"
import { useEffect, useRef, useState } from "react"
import { userService } from "../services/user.service"


export function Trip() {
    const navigate = useNavigate()
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const userLogged = useSelector(storeState => storeState.userModule.user)
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await userService.getUsers()
                setUsers(users)
            } catch (error) {
                console.log("Error fetching users:", error)
            }
        }
        fetchUsers()

    }, [])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userOrders = await orederService.getOrderByBuyer(userLogged._id)
                setOrders(userOrders)
            } catch (error) {
                console.log("Error fetching orders:", error)
            }
        }

        if (userLogged) {
            fetchOrders()
        }
    }, [userLogged])

    // Function to format the check-in and check-out dates
    const formatDateRange = (checkin, checkout) => {
        const checkinDate = new Date(checkin)
        const checkoutDate = new Date(checkout)

        const formattedCheckin = `${checkinDate.toLocaleString('en-US', { month: 'short' })} ${checkinDate.getDate()}`
        const formattedCheckout = `${checkoutDate.toLocaleString('en-US', { month: 'short' })} ${checkoutDate.getDate()}`

        return `${formattedCheckin} - ${formattedCheckout}`
    }

    // Function to get the approval status
    const getApprovalStatus = (isApproved) => {
        return isApproved ? 'Approved' : 'Pending'
    }

    function getHostsInfo(hostId) {
        if (users.length) {
            const host = users.find(user => user._id === hostId)
            return { img: host.imgUrl, name: host.fullname }
        }
    }

    function cancelOrder(orderId) {
        console.log(orderId)
    }

    return (
        <>
            {userLogged ?
                <div>
                    <h1>Welcome back, {userLogged.fullname}</h1>
                    <h1>Trips</h1>

                    {orders.length && orders.length ?
                        <table className="trip-table">

                            <thead>
                                <tr>
                                    <td>Host</td>
                                    <td>Stay</td>
                                    <td>Dates</td>
                                    <td>Nights</td>
                                    <td>Guests</td>
                                    <td>Total Price</td>
                                    <td>Status</td>
                                    <td>Action</td>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const hostInfo = getHostsInfo(order.hostId)
                                    return (
                                        <tr key={order._id}>
                                            {hostInfo && <td>
                                                {hostInfo.name}
                                            </td>}
                                            <td>{stays && stays.find(stay => stay._id === order.stayId).name} </td>
                                            <td>{formatDateRange(order.info.checkin, order.info.checkout)}</td>
                                            <td>Nigh</td>
                                            <td>Guests</td>
                                            <td>${order.info.price}</td>
                                            <td>{getApprovalStatus(order.isApproved)}</td>
                                            <td>
                                                <button onClick={() => cancelOrder(order._id)}>Cancel</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        :
                        <div>
                            <h3>No trips booked...yet!</h3>
                            <p>Time to dust off your bags and start planning your next adventure</p>
                            <button onClick={() => navigate('/')}>Start searching</button>
                        </div>
                    }
                </div>
                : navigate('/')
            }
        </>
    )
}