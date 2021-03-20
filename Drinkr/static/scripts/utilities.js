
function getCurrentPlayer(sequence) {
    for (p in players)
        if (players[p].sequence == sequence)
            return p;
    return null;
}