const bunyan = require('bunyan')

exports.loggerInstance = bunyan.createLogger({
    name: 'transaction-notifier',
    serializers: {
        req: require('bunyan-express-serializer'),
        res: bunyan.stdSerializers.res,
        err: bunyan.stdSerializers.err
    },
    level: 'info',
    streams: [{
            path: './foo.log',
        },
        {
            stream: process.stdout
        }
    ]
});

exports.logResponse = function (id, body, statusCode) {
    var log = this.loggerInstance.child({
        id: id,
        body: body,
        statusCode: statusCode
    }, true)
    log.info('response')
}