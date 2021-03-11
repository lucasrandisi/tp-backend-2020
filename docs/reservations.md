## Reservations

Se quiere insertar una reserva validada con los siguientes datos de entrada de tal forma que no se superponga con ninguna otra.

IN: `@persons,@name, @phone, @email, @persons, @resDateTime`

```sql
set @interval = 45;
start transaction;
```

Obtengo los id's de aquellas mesas que están reservadas entre la fecha indicada y un intervalo de tiempo fijo en minutos a partir del inicio de la reserva

```sql
drop table if exists res;

create temporary table if not exists res
select r.tableId
from reservations r
inner join restaurant.tables t on t.id = r.tableId
where r.cancelationDateTime is null and
(r.reservationDateTime between @resDateTime and date_add(@resDateTime, INTERVAL @interval MINUTE))
order by t.size asc;
```

Selecciono la mesa disponible mas chica y que pueda alojar la cantidad de personas deseadas. Para eso se seleccionan aquellas mesas que no estan en la tabla temporal. Luego se ordena por tamaño ascendente y se selecciona la primera.

```sql
select t.id into @id
from restaurant.tables t
where t.id not in (select tableId from res)
and t.size >= @persons
order by t.size asc
limit 1;
```

Si `@id > 0` quiere decir que hay al menos 1 mesa disponible para reservar para esa cantidad de personas y en ese rango horario. Luego solo falta insertar los datos en la tabla

```sql
insert into reservations (customerName, phone, email, partySize, reservationDateTime, createdAt, updatedAt, tableId)
values (@name, @phone,@email,@persons,@resDateTime, now(), now(), @id);
```

Por ultimo, se cierra la transaccion

```sql
commit;
```
