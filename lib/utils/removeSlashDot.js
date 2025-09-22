function removeSlashDot(path) {
    return path?.replace(/^(\.\/|\/|\.)/, "");
}

export default removeSlashDot;
