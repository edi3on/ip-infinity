CREATE TABLE royalties (
    id SERIAL PRIMARY KEY,
    ens VARCHAR(255),
    ipas JSONB DEFAULT '{"ipa_address": null, "royalties": null, "claimed": null, "unclaimed": null}'
);