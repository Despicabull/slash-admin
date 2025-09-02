import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import roleService from "@/api/services/roleService";
import type { Role } from "@/types/entity";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

interface EntityModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: any) => void;
	title: string;
	entity?: any;
	entityType: "group" | "role" | "user" | "site";
	roles?: Role[]; // For user entity type
}

// Define individual schemas for validation
const groupSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

const roleSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

const userSchema = z.object({
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters").optional(),
	role: z
		.object({
			id: z.string(),
			name: z.string(),
			code: z.string(),
		})
		.nullable()
		.optional(),
});

const siteSchema = z.object({
	name: z.string().min(1, "Name is required"),
	address: z.string().optional(),
	description: z.string().optional(),
});

export default function EntityModal({
	open,
	onClose,
	onSubmit,
	title,
	entity,
	entityType,
	roles = [],
}: EntityModalProps) {
	const [loading, setLoading] = useState(false);
	const [roleOptions, setRoleOptions] = useState<Role[]>([]);

	// Use a flexible form that can handle all field types
	const form = useForm<any>({
		defaultValues: entity || {},
	});

	useEffect(() => {
		const loadRoles = async () => {
			if (entityType === "user" && roles.length === 0) {
				try {
					const fetchedRoles = await roleService.fetchRoles();
					setRoleOptions(fetchedRoles);
				} catch (error) {
					console.error("Failed to fetch roles", error);
				}
			} else if (entityType === "user") {
				setRoleOptions(roles);
			}
		};

		loadRoles();
	}, [entityType, roles]);

	const validateForm = (values: any) => {
		switch (entityType) {
			case "group":
				return groupSchema.parse(values);
			case "role":
				return roleSchema.parse(values);
			case "user":
				// For user creation, password is required
				if (!entity) {
					return userSchema.parse(values);
				}
				// For user update, password is optional
				return userSchema.parse(values);
			case "site":
				return siteSchema.parse(values);
			default:
				return values;
		}
	};

	const handleSubmit = async (values: any) => {
		setLoading(true);
		try {
			// Validate using the appropriate schema
			const validatedData = validateForm(values);
			await onSubmit(validatedData);
			onClose();
		} catch (error) {
			if (error instanceof z.ZodError) {
				// Set form errors from Zod validation
				error.errors.forEach((err) => {
					if (err.path.length > 0) {
						form.setError(err.path[0] as string, { message: err.message });
					}
				});
			} else {
				console.error(`Failed to ${entity ? "update" : "create"} ${entityType}`, error);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			onClose();
		}
	};

	// Get available roles for the dropdown
	const availableRoles = roleOptions.length > 0 ? roleOptions : roles;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
						{(entityType === "group" || entityType === "role" || entityType === "site") && (
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{entityType === "user" && (
							<>
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input placeholder="Enter username" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder="Enter email" type="email" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role</FormLabel>
											<FormControl>
												<Select
													onValueChange={(value) => {
														const selectedRole = availableRoles.find((role) => role.id === value);
														if (selectedRole) {
															field.onChange(selectedRole);
														}
													}}
													value={field.value?.id || ""}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select a role" />
													</SelectTrigger>
													<SelectContent>
														{availableRoles.map((role) => (
															<SelectItem key={role.id} value={role.id}>
																{role.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{!entity && (
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input placeholder="Enter password" type="password" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</>
						)}

						{(entityType === "group" || entityType === "role" || entityType === "site") && (
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input placeholder="Enter description" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{entityType === "site" && (
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Input placeholder="Enter address" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<DialogFooter>
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? "Saving..." : entity ? "Update" : "Create"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
