const expect    = require('expect');
const request   = require('supertest'); 
const {ObjectID} = require('mongodb');

const {app}     = require('./../server'); 
const {Todo}    = require('./../app_api/models/Todo'); 
const seedTodos = [
    { _id: new ObjectID(), text: 'First test todo'},
    { _id: new ObjectID(), text: 'Second test todo'}
];
beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(seedTodos);
    }).then(() => done()); 
})
describe('POST /todos', () => {
    it('Should create a new todo', (done) => {
        var text = 'First test todo'; 
        request(app) 
            .post('/new/todo') // we simulate a post request 
            .send({text})       // we send the text variable --> text: text
            .expect(200)        // we expect to have status 200
            .expect((res) => {  // we check if the res.body.text is equal to text
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                // If err we stop the test returning error object
                if (err) return done(err); 

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(2);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((error) => done(error));

            })
    });

    it('Should not create a new todo with invalid data', (done) => {
        var text = 'other todo';
        request(app)
            .post('/new/todo')
            .send()
            .expect(400)
            .end((err, res) => {
                if (err) return done(err); 

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err)); 
            })
    })
});

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end( done );
    })
})

describe('GET /todos/:id', () => {
    it('Should get a single todo', (done) => {
        request(app)
            .get(`/todos/${seedTodos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(seedTodos[0].text);
            })
            .end( done );

    })

    it('Should return not found', (done) => {
        var hexId = new ObjectID().toHexString(); 

        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    }); 

    it('Should return 404 status for non id object', (done) => { 

        request(app)
            .get(`/todos/78945aa`)
            .expect(404)
            .end(done);
    }); 
})
