const helmet=require('helmet');
const compression=require('compression');
module.children=function(app)
{
    app.use(helmet());
    app.use(compression());
}
