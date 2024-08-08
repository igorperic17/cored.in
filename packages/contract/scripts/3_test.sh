# ./scripts/1_build.sh

# build  binary for build speed
# docker run --rm -v "$(pwd)":/code --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/optimizer:0.15.0

# arm version of the Docker optimizer image
# docker run --rm -v "$(pwd)":/code --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/optimizer-arm64:0.16.0

# build raw
cargo build --target wasm32-unknown-unknown --lib --out-dir ./artifacts -Z unstable-options

# run tests
RUST_BACKTRACE=1 cargo test