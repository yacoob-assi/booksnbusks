import StudentLayout from "../../../layouts/student";
import {useFetch} from "../../../helpers/hooks";
import {fetchQuizzes, fetchSubmissions} from "../../../helpers/backend_helper";
import Link from 'next/link'
import moment from "moment";
import {ButtonGroup} from "react-bootstrap";
import {useState} from "react";
import Pagination from "../../../components/common/pagination";
import Button from '../../../components/form/Button.js';


  
const Quiz = () => {
    const [tab, setTab] = useState('due')
    const [quizzes, setQuizzes] = useFetch(fetchQuizzes, {date: moment().format('YYYY-MM-DD')})
    const [graded, getGraded] = useFetch(fetchSubmissions, {size: 4, graded: true})
    console.log("Graded:", graded);

    return (
    <>
    <div className="flex bg-white p-4 rounded-lg items-center">
        <img className="h-32" src="/images/hello.svg" alt=""/>
    <div>
        {quizzes?.length == 1 ? (
        <p className="text-2xl font-semibold pl-2 md:pl-8 mb-0">
            You have {quizzes?.length} new quiz available
        </p>
        ) : (
        <p className="text-2xl font-semibold pl-2 md:pl-8 mb-0">
            You have {quizzes?.length || 0} new quizzes available
        </p> )}
        </div>
        </div>
        <ButtonGroup className="mt-3">
            <button
            onClick={() => setTab('due')}
            className={(tab === 'due' ? 'bg-gray-600' : 'bg-gray-400') + " text-white px-3 py-2 rounded-l"}>Due
            </button>
            <button onClick={() => setTab('graded')}
            className={(tab === 'graded' ? 'bg-gray-600' : 'bg-gray-400') + " text-white px-3 py-2 rounded-r"}>Graded
            </button>
        </ButtonGroup>
        {tab === 'due' && (
            <div className="mt-3">
                {quizzes?.map((quiz, index) => (
                <div className="px-3 pt-3 pb-2 d-flex justify-content-between bg-white mb-3 rounded-lg"
                key={index}>
            <div>
                <h2 className="font-weight-bold text-lg font-semibold">{quiz.title}</h2>

            <div>
            <p className="mb-2">
                Class:
                {quiz?.classes?.map((data, index) => (
                    <span key={index} className="tag-red ml-2">
                        {`${index > 0 ? ', ' : ''}${data?.name}`}
                    </span>
                ))}
            </p>
            <p className="mb-3">
                Due: 
                <span className="date-tag day ml-2">
                    {moment(quiz.submission_end).format('ddd, MMM Do')}
                </span>
                at 
                <span className="date-tag time ml-2">
                    {moment(quiz.submission_end).format('hh:mm A')}
                </span>
            </p>
        </div>
            </div>
            <div className="flex items-center">
                {moment(quiz.submission_start).isSameOrBefore(moment()) ? (
                <Link href={'/student/quiz/' + quiz._id}>
                    <Button>Take Quiz</Button>
                </Link>
                ) : (
                <h5 className="text-end">Quiz will open on<br/>{moment(quiz.submission_start).format('dddd, MMMM Do, hh:mm A')}</h5>
                )}
                </div>
                </div>
                ))}
                {quizzes?.length === 0 && <h2 className="text-primary py-2"></h2>}
            </div>
        )}
        {/*tab === 'completed' && (
            <div className="mt-3"> {completed?.docs?.map((sub, index) => (
                sub.quiz ? (
                <div className="px-3 pt-3 pb-2 d-flex justify-content-between bg-white mb-3 rounded-lg"
                key={index}>
                <div>
                    <h4 className="font-weight-bold text-lg font-semibold">{sub.quiz.title}</h4>
                    <p className="mb-2">{sub.quiz?.classes?.map((data, index) => `${index > 0 ? ', ' : ''}${data?.name}`)}</p>
                    <p className="mb-1 text-danger">Submitted: {moment(sub.date).format('dddd, MMMM Do, hh:mm A')}</p>
                </div>
                </div>
            ) : null
            ))}
                {completed?.docs?.length > 0 ? (
                <Pagination
                pageCount={completed?.totalPages || 1}
                page={completed?.page || 1}
                onPageChange={(page) => getCompleted(page)}
                />
                ) : (
                <h2 className="text-primary py-2">No Submissions found</h2>
                )}
                </div>
        )*/}
        {tab === 'graded' && (
            <div className="mt-3">
                {graded?.docs?.map((sub, index) => (sub.quiz ? (
                <div className="px-3 pt-3 pb-2 d-flex justify-content-between bg-white mb-3 rounded-lg" key={index}>
                    <div>
                        <h2 className="font-weight-bold text-lg font-semibold">{sub.quiz.title}</h2> {/* Bold Title */}
                    <div>
                        <p className="mb-2">
                            Class:
                            {sub.quiz?.classes?.map((data, index) => (
                                <span key={index} className="tag-red ml-2">
                                    {`${index > 0 ? ', ' : ''}${data?.name}`}
                                </span>
                            ))}
                        </p>
                        <p className="mb-3">
                            Submitted:
                            <span className="date-tag day ml-2">
                                {moment(sub.date).format('ddd, MMM Do')}
                            </span>
                            at
                            <span className="date-tag time ml-2">
                                {moment(sub.date).format('hh:mm A')}
                            </span>
                        </p>
                    </div>

                    </div>
                    <h3 className="p-2">{sub.percentage !== null && sub.percentage !== undefined ? `${sub.percentage}%` : 'N/A'}</h3>
                </div>
                ) : null
                ))}
                {graded?.docs?.length > 0 ? (
                <Pagination
                    pageCount={graded?.totalPages || 1}
                    page={graded?.page || 1}
                    onPageChange={(page) => getGraded(page)}/>
                ) : (
                <h2 className="text-primary py-2">No Submissions found</h2>
                )}
            </div>
            )}
            </>
            )
        }
Quiz.layout = StudentLayout
export default Quiz