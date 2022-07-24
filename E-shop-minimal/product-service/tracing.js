'use strict';

const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const EXPORTER = process.env.EXPORTER || '';

module.exports = (serviceName) => {
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    });

    let exporter;
    if (EXPORTER.toLowerCase().startsWith('z')) {
        exporter = new ZipkinExporter();
    } else {
        exporter = new JaegerExporter();
    }

    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

    // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
    provider.register();

    registerInstrumentations({
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
            new MongoDBInstrumentation(),
        ],
    });

    return opentelemetry.trace.getTracer('http-example');
};