import Bee from 'beequeue';
import CancelationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancelationMail]

class Queue{
    
    constructor(){
        this.queue = {}

        this.init();
    }

    init(){
        jobs.forEach(({ key , handle }) => {
            this.queue[key] = {
                bee: new Bee(key,{
                    redis: redisConfig,
                }),
                handle,
            };
        })
    }

    add(wichQueue,job){
        return this.queue[wichQueue].bee.createJob(job).save();
    }

    processQueue(){

        

        jobs.forEach( job => {
                
            const { bee, handle } = this.queue[job.key];

            bee.on('ready',()=>{
                console.log('queue are now ready to start doing things');
            })


            bee.on('failed',this.handleFailure).process(handle);

        })

    }

    handleFailure(job, err){
        console.log(`Queue: ${ job.queue.name}: FAILED `, err);
    }
}

export default new Queue();