import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PriceDetails } from "../cmps/price-details";



export function ConfirmOrder() {

    const [searchParams] = useSearchParams()
    const [formDetails, setFormDetails] = useState(null)


    // First load
    useEffect(() => {

        const params = searchParams.get('order')
        if (params) setFormDetails(JSON.parse(params))
        console.log(JSON.parse(params))

    }, [])

    function calculateNumberOfNights(start, end) {
        console.log(start)
        console.log(end)
        const startDate = new Date(start)
        const endDate = new Date(end)
        const timeDifference = endDate.getTime() - startDate.getTime()
        const numberOfNights = Math.ceil(timeDifference / (1000 * 3600 * 24))
        return numberOfNights
    }

    function convertDates(time) {
        console.log('time :', time)
        const timestamp = time
        const date = new Date(timestamp)

        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
        const day = date.getDate()

        const convertedDate = `${month} ${day}`

        return convertedDate
    }

    if (!formDetails) return

    return (
        <section className="confirm-order-container">
            <div className="column1-content">
                <h1> Confirm your trip </h1>
                <h2> Your trip </h2>

                <div className="dates-container">
                    <h4> Dates </h4>
                    <div className="check-in-date flex align-center">
                        <span> Check in </span>
                        <p> {convertDates(formDetails.info.checkin)} </p>
                    </div>
                    <div className="check-out-date flex align-center">
                        <span> Check out </span>
                        <p> {convertDates(formDetails.info.checkout)} </p>
                    </div>
                </div>
            </div>

            <div className="column2-content">
                <PriceDetails price={formDetails.info.price} checksDates={{ checkIn: formDetails.info.checkin, checkOut: formDetails.info.checkout }} calculateNumberOfNights={calculateNumberOfNights} />
            </div>

            <Link to='/'> <button> Back </button> </Link>
        </section>
    )
}