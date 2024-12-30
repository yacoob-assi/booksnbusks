import TeacherLayout from "../../../layouts/teacher";
import FormInput, {HiddenFormItem} from "../../../components/form/FormInput";
import {Col, Row, Button} from "react-bootstrap";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchClasses, fetchQuiz, postQuizUpdate} from "../../../helpers/backend_helper";
import CardSelector from "../../../components/form/CardSelector";
import DateTime from "../../../components/form/DateTime";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import moment from "moment";
import {DatePicker, Form, Popconfirm} from "antd";
import { Question } from "./create";
import {FiArrowLeft} from "react-icons/fi";


const UpdateQuiz = () => {

    const router = useRouter()
    const [form] = Form.useForm()
    const [quiz] = useFetch(fetchQuiz, {_id: router.query?._id})
    const [classes] = useFetch(fetchClasses, {nameOnly: true, mine: true})
    const [changed, setChanged] = useState(false)
    const [sumErrorMessage, setSumErrorMessage] = useState(null);

    //predetermined value (at the moment quizzes are worth 10 points)
    const awardPoints = 10;

    useEffect(() => {
        if (quiz) {
            form.setFieldsValue({
                ...quiz,
                questions: quiz.questions || [], // Make sure questions is an array
                submission_start: moment(quiz?.submission_start),
                submission_end: moment(quiz?.submission_end),
            });
        }
    }, [quiz]);

    const validateSumOfPoints = (values) => {
        const sumOfPoints = values?.questions?.reduce((sum, question) => sum + (+question.points), 0);
        if (sumOfPoints !== awardPoints) {
            setSumErrorMessage(`Sum of question points should equal ${awardPoints}`);
            return false;
        } else 
        setSumErrorMessage(null);
        return true;
    };

    const onFinish = (values) => {
        console.log(values);
        if (!validateSumOfPoints(values)) return; // Check sum of question points

        values?.questions?.forEach((question) => {
            values._id = router.query?._id; // Adding id of the quiz to info sent to backend
            question.points = +question.points;
            question.min = +question.min || 0;
            question.max = +question.max || 0;
            question.options = question.type === 'single' || question.type === 'multiple' ? question.options : [];
        });

        // Add the predefined awardPoints to values before submitting
        values.points = awardPoints;

        return useAction(postQuizUpdate, values, () => {
            router.push('/teacher/quiz');
        });
    };


    return (
    <>
    <h4 className="font-22 font-semibold"><FiArrowLeft className="mr-2 inline-block" role="button" onClick={() => router.back()}/> Update Quiz</h4>
    <hr className="bg-C4"/>

    <Form layout="vertical" form={form} onFinish={onFinish}> 

    <Row>
    <Col md={6}>
    <FormInput name="title" label="Quiz Title"
    placeholder="Enter quiz name (i.e. ITP 348 Intro to Web Development)" required/>
    <Form.Item name={'submission_start'} label="Submission Start" initialValue={moment().startOf('day')} 
    rules={[{required: true, message: 'Please provide submission date.'}]}>
        <DateTime/>
        </Form.Item>
        <FormInput name="points" label="Award Points" type="number" initialValue={awardPoints} readOnly rules={[() => ({
            validator(_, value) {
                if (value == awardPoints) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error(`All quizzes are worth ${awardPoints} points`));
            },
        })
        ]} required/>
        </Col>
        <Col md={6}>
            <FormInput name="course" label="Course Number" placeholder="Enter section"/>
            <Form.Item name={'submission_end'} label="Submission End" initialValue={moment().endOf('day')}
            rules={[{required: true, message: 'Please provide submission date.'},
            ({getFieldValue}) => ({
                validator(_, value) {
                    if (getFieldValue('submission_start').isBefore(value)) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Submission End must be after Submission Start'));
                },
            })]}>
                <DateTime/>
                </Form.Item>
                </Col>
                <Col md={12}>
                <CardSelector name="classes" label="Class"
                    options={classes}
                    required/>
                <p className="mt-2 text-base font-semibold">Questions</p>
                <div className="p-4 bg-F8 rounded">
                    <Form.List name="questions">
                        {(fields, {add, remove}) => (
                        <>
                        {fields.map(({key, name, fieldKey, ...restField}) => (
                        <Question key={key} name={name} fieldKey={fieldKey}
                            onRemove={() => remove(name)} restField={restField} form={form}
                            setChanged={setChanged}/>
                        ))}
                <button type="button" className="rounded btn-primary mx-auto mt-2"
                onClick={() => add()
                        }>Add Question</button>
                </>
                )}
                </Form.List>
                </div>
                </Col>
            </Row>
                <Form.Item>
                <Button type="primary" htmlType="submit" className="mt-4 rounded">Add Quiz</Button>
            </Form.Item>
            </Form>
            {sumErrorMessage && <div className="alert alert-danger">{sumErrorMessage}</div>}
                </>
            );
        };
UpdateQuiz.layout = TeacherLayout
export default UpdateQuiz

  

