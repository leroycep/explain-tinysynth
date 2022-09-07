struct PeriodicWave {
    imaginary: Vec<f32>,
    real: Vec<f32>,
}

// Takes a string in the format of `w999`, where 9 could be any digit and
// returns an array of real an imaginary numbers
fn from_w_string(w_string: &str) -> Result<PeriodicWave, String> {
    let characters = w_string.chars();

    // skip the w
    characters.skip(1);
    
    let mut imaginary = Vec::new();
    imaginary.push(0.0);
    for character in characters {
        let digit_value = character.to_digit(10).ok_or_else(|| String::from("Invalid w_string format"))?;
        imaginary.push(digit_value as f32);
    }
    
    let real = vec![0.0; imaginary.len()];
    
    Ok(PeriodicWave{ imaginary, real })
}

// Generate white noise
fn fill_with_white_noise(buffer: &mut [f32]) {
    for i in 0..buffer.len() {
        buffer[i] = fastrand::f32() * 2.0 - 1.0;
    }
}

// Generate noise by combining a bunch of sine waves
fn fill_with_sinusoidal_noise(buffer: &mut [f32]) {
    let ITERATIONS = 64;
    for _ in 0..ITERATIONS {
        // Generate 2 random frequencies
        let random_frequency1 = 440.0 * (fastrand::f32() * 10.0 + 1.0);
        let random_frequency2 = 440.0 * (fastrand::f32() * 10.0 + 1.0);
        for i in 0..buffer.len() {
            // We'll treat the noise buffer as a circle, where playing the entire sample gives you one rotation
            let angle = (i as f32 / buffer.len() as f32) * 2.0 * std::f32::consts::PI;
            let wave1 = (angle * random_frequency1).sin();
            let wave2 = (angle * random_frequency2).sin();

            let value = wave1 * wave2;

            buffer[i] += value / 8.0;
        }
    }
}
