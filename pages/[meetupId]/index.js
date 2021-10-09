import Head from 'next/head'
import { MongoClient, ObjectId } from 'mongodb'
import MeetupDetail from '../../components/meetups/MeetupDetail'
import { Fragment } from 'react'

function MeetupDetails(props) {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content={props.meetupData.description}/>
            </Head>
            <MeetupDetail
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </Fragment>
    )
}

export async function getStaticPaths() {

    const client = await MongoClient.connect('mongodb+srv://stefano:43214321campbell@cluster0.1ezte.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db()

    const meetupsCollection = db.collection('meetups')
    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()

    client.close()

    return {
        paths: meetups.map(meetup => ({
            params: {
                meetupId: meetup._id.toString()
            }
        })),
        fallback: 'blocking'
    }
}

export async function getStaticProps(context) {

    const meetupId = context.params.meetupId
    const client = await MongoClient.connect('mongodb+srv://stefano:43214321campbell@cluster0.1ezte.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db()

    const meetupsCollection = db.collection('meetups')
    const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) })

    client.close()
    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                image: selectedMeetup.image,
                address: selectedMeetup.address,
                description: selectedMeetup.description
            }
        }
    }
}

export default MeetupDetails