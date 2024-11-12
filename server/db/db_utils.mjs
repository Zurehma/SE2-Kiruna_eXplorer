const delete_table = function (db, table) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM ${table}`, (err) => {
            if (err) {
                reject(err);
            }
            resolve({
                table: table,
                dropped: true
            });
        });
    });
};

const empty_db = function (db, tables) {
    return new Promise((resolve, reject) => {
        db.serialize(async () => {
            for (let table of tables) {
                let infos = [];
                try {
                    const info = await delete_table(db, table);
                    infos.push(info);
                } catch (err) {
                    reject(err);
                }
                resolve(infos);
            }
        });
    });
};

export { delete_table, empty_db };    