import Head from 'next/head'
import { MongoClient } from 'mongodb'
import MeetupList from '../components/meetups/MeetupList'
import { Fragment } from 'react'

function HomePage(props) {

    return (
            <Fragment>
                <Head>
                    <title>NextJS Meetups</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta name="description" content="A NextJS application to submit and view meetups" />
                </Head>
                <MeetupList meetups={props.meetups} />
            </Fragment> 
    )
}

// export async function getServerSideProps(context) {
//     const req = context.req
//     const res = context.res

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export async function getStaticProps(context) {

    const client = await MongoClient.connect('mongodb+srv://stefano:43214321campbell@cluster0.1ezte.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db()

    const meetupsCollection = db.collection('meetups')
    const meetups = await meetupsCollection.find().toArray()

    client.close()

    return {
        props: {
            meetups: meetups.map(meetup => ({
                id: meetup._id.toString(),
                title: meetup.title,
                image: meetup.image,
                address: meetup.address
            }))
        },
        revalidate: 10
    }
}

export default HomePage